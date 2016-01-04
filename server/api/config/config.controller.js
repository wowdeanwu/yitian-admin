'use strict';

var _ = require('lodash');

var mysql      = require('mysql');

var mysqlPool = mysql.createPool({
  host     : '****',
  port     :  3306,
  database : '****',
  user     : '****',
  password : '****',
});

exports.list = function(req, res) {

  mysqlPool.getConnection(
    function(err,connection){
        connection.query('SELECT * FROM config', function(err, rows, fields) {
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
   var data = {
     config_id : 'qqqqqq',
     module:'DEFAULT',
     config_key:'test',
     config_value:'testtest',
     created_date: new Date()
   };

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
