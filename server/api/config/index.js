'use strict';

var express = require('express');
var controller = require('./config.controller');

var router = express.Router();

router.get('/', controller.list);

router.get('/:id', controller.detail);

router.put('/', controller.update);

router.post('/', controller.create);

router.delete('/:id', controller.delete);

module.exports = router;
