'use strict';

var _ = require('lodash');
var moment = require('moment');
var redis = require('redis');

var env = require('../../config/environment');

var client = redis.createClient({
    host:env.redis.host,
    port:env.redis.port
});
client.auth(env.redis.password,function(){
    console.log('auth success!')
})
client.select(5,function(){
    console.log('change the redis 5 db success!')
});
client.on("error", function (err) {
    console.log("Error " + err);
});
exports.list = function(req, res) {
    var data = [];
    client.keys('*',function(err,replies){
        replies.forEach(function(reply,i){
            client.hgetall(reply,function(err,obj){
                data.push(obj);
                if(replies.length === i + 1){
                    res.json(data);
                    client.quit();
                }
            });
        });
    });

};

exports.detail = function(req, res) {


};

exports.create = function(req, res) {

};

exports.update = function(req, res) {

};

exports.delete = function(req, res) {
};
