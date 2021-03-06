'use strict';

var _ = require('lodash');
var moment = require('moment');
var mysql = require('mysql');

var mysqlConfig = require('../../config/environment');

var mysqlPool = mysql.createPool(mysqlConfig.mysql);

exports.list = function(req, res) {
  var query = req.query;
  var sql = 'SELECT * FROM config WHERE 1 ';
  var values = [];

  if (!_.isEmpty(query.module)) {
    sql += ' AND MODULE like ? ';
    values.push('%' + query.module + '%')
  }

  mysqlPool.getConnection(
    function(err, connection) {
      connection.query({
        sql: sql,
        values: values
      }, function(err, rows, fields) {
        if (err) throw err;
        res.json(rows);
        connection.release();
      });
    });

};

exports.detail = function(req, res) {

  mysqlPool.getConnection(
    function(err, connection) {
      connection.query('SELECT * FROM config WHERE config_id=?', req.params.id, function(err, result) {
        if (err) throw err;
        res.json(result[0]);
        connection.release();
      });
    });

};

exports.create = function(req, res) {

  var data = req.body;
  data.config_id = 'CONFIG' + moment().format("YYYYMMDD") + _.random(1000, 9999);
  data.created_date = new Date();
  data.type = 0;
  data.status = 1;

  mysqlPool.getConnection(
    function(err, connection) {
      connection.query('INSERT INTO config SET ?', data, function(err, result) {
        if (err) throw err;
        res.json(data);
        connection.release();
      });
    });
};

exports.update = function(req, res) {
  var data = req.body;

  var sql = 'UPDATE config SET ';
  var values = [];
  if (data.MODULE) {
    sql += ' MODULE=?,';
    values.push(data.MODULE);
  }
  if (data.CONFIG_KEY) {
    sql += ' CONFIG_KEY=?,';
    values.push(data.CONFIG_KEY);
  }
  if (data.CONFIG_VALUE) {
    sql += ' CONFIG_VALUE=?,';
    values.push(data.CONFIG_VALUE);
  }
  if (data.NAME) {
    sql += ' NAME=?,';
    values.push(data.NAME);
  }
  if (data.DESCRIPTION) {
    sql += ' DESCRIPTION=?,';
    values.push(data.DESCRIPTION);
  }
  sql = _.trimRight(sql, ',');
  sql += ' WHERE CONFIG_ID=?';
  values.push(req.params.id);
  console.log(sql);
  console.log(values);
  mysqlPool.getConnection(
    function(err, connection) {
      connection.query({
        sql: sql,
        values: values
      }, function(err, result) {
        if (err) throw err;
        res.json(result);
        connection.release();
      });
    });

};

exports.delete = function(req, res) {};