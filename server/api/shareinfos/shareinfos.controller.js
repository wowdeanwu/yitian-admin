'use strict';

var _ = require('lodash');
var moment = require('moment');
var mysql = require('mysql');

var mysqlConfig = require('../../config/environment');

var mysqlPool = mysql.createPool(mysqlConfig.mysql);

exports.list = function(req, res) {
  var query = req.query;
  var sql = 'SELECT * FROM t_share_info WHERE 1 ';
  var values = [];

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
      connection.query('SELECT * FROM t_share_info WHERE share_info_id=?', req.params.id, function(err, result) {
        if (err) throw err;
        res.json(result[0]);
        connection.release();
      });
    });

};

exports.create = function(req, res) {

  var data = req.body;
  data.share_info_id = 'SFI' + moment().format("YYYYMMDD") + _.random(1000, 9999);
  data.created_date = new Date();
  data.share_way = 0;

  mysqlPool.getConnection(
    function(err, connection) {
      connection.query('INSERT INTO t_share_info SET ?', data, function(err, result) {
        if (err) throw err;
        res.json(data);
        connection.release();
      });
    });
};

exports.update = function(req, res) {
  var data = req.body;

  var sql = 'UPDATE t_share_info SET ';
  var values = [];
  if (data.TITLE) {
    sql += ' TITLE=?,';
    values.push(data.TITLE);
  }
  if (data.DESCRIPTION) {
    sql += ' DESCRIPTION=?,';
    values.push(data.DESCRIPTION);
  }
  if (data.IMG_URL) {
    sql += ' IMG_URL=?,';
    values.push(data.IMG_URL);
  }
  if (data.LINK) {
    sql += ' LINK=?,';
    values.push(data.LINK);
  }
  if (data.BUSINESS_TYPE) {
    sql += ' BUSINESS_TYPE=?,';
    values.push(data.BUSINESS_TYPE);
  }
   if (data.COMMENT) {
    sql += ' COMMENT=?,';
    values.push(data.COMMENT);
  }
  sql = _.trimRight(sql, ',');
  sql += ' WHERE SHARE_INFO_ID=?';
  values.push(req.params.id);
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