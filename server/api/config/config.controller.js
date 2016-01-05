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

  if(!_.isEmpty(query.module)){
    sql += ' AND MODULE like ? ';
    values.push('%' + query.module + '%')
  }
  
  mysqlPool.getConnection(
    function(err,connection){
        connection.query({
          sql:sql,
          values:values
        }, function(err, rows, fields) {
          if (err) throw err;
          res.json(rows);
          connection.release();
        });
  });

};

exports.detail = function(req, res) {

      mysqlPool.getConnection(
        function(err,connection){
            connection.query('SELECT * FROM config WHERE config_id=?',req.params.id, function(err,result) {
              if (err) throw err;
              res.json(result[0]);
              connection.release();
            });
      });

};

exports.create = function(req, res) {
  
  var data = req.body;
  data.config_id = 'CONFIG' + moment().format("YYYYMMDD") + _.random(1000,9999);
  data.created_date = new Date();
  data.type = 0;
  data.status = 1;

  mysqlPool.getConnection(
    function(err,connection){
        connection.query('INSERT INTO config SET ?',data, function(err,result) {
          if (err) throw err;
          res.json(data);
          connection.release();
        });
  });
};

exports.update = function(req, res) {
    mysqlPool.getConnection(
      function(err,connection){
          connection.query('UPDATE config SET config_value=?,module=?, where config_id=?',data, function(err,result) {
            if (err) throw err;
            res.json(data);
            connection.release();
          });
    });

};

exports.delete = function(req, res) {
};
