var express = require('express');
var router = express.Router();
var model = require('../models');

/* get admin page */
router.get('/admin', function(request, response, next){
    response.render('admin', {});
} )
