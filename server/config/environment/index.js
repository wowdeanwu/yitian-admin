'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'yitian-admin-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // Mysql  DB connection options
  mysql: {
    host     : '****',
    port     :  3306,
    database : '****',
    user     : '****',
    password : '****',
  },
  redis:{
    host  : '****',
    port  : 6379,
    password: '****',
    db    : 0
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
