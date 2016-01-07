'use strict';

var _ = require('lodash');
var moment = require('moment');
var redis = require('redis');

var env = require('../../config/environment');

var client = getRedisClient();

function getRedisClient(){
    var _client = redis.createClient({
        host:env.redis.host,
        port:env.redis.port
    });
    _client.auth(env.redis.password,function(){
        console.log('auth success!')
    })
    _client.select(env.redis.db,function(){
        console.log('change the redis ' + env.redis.db +' db success!')
    });
    _client.on("error", function (err) {
        console.log("Error " + err);
    });
    return _client;
}

exports.list = function(req, res) {
    var data = [];
    client.keys('*',function(err,replies){
        replies.forEach(function(reply,i){
            var obj = {
                key:reply
            }
            data.push(obj);
            if(replies.length === i + 1){
                res.json(data);
            }

        });
    });

};

exports.detail = function(req, res) {
    var key = req.params.id;
    client.hgetall(key,function(err,obj){
        if(err)
            throw(err);
        if(!_.isEmpty(obj))
            res.json({
                key:key,
                value:JSON.stringify(obj)
            });
    });
};

exports.create = function(req, res) {

};

exports.update = function(req, res) {

};

exports.delete = function(req, res) {
    var key = req.params.id;
    client.del(key,function(err,result){
        if(err)
            throw(err);
        if(result > 0){
            res.json({
                key:key,
                result:result
            });
        }

    });
};
