var express = require('express');
var path = require('path');
var User = require('./../db/user');
var router = express.Router();
var login = require('../db/login');
var querystring = require("querystring");
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next){
	console.log("[GET] '/'")
	res.sendFile(path.join(__dirname, '../', 'index.html'));
  console.log(path.join(__dirname, '../', 'index.html'));
});

router.post('/login', function(req, res){
	var body = '';
	req.on('data', function(data){
		body+=data;
	});
	req.on('end',function(){
		var para = querystring.parse(body);
		var name = para.Account;
		var password = para.Password;

	User.findOne({ "name" : name },'password',  function (err, user) {
  		if (err) return console.log(err);
  		if (user == null)
  			res.send({msg:"fail"});
  		else
  			res.send({msg:"success"});
	});



		//console.log(name + "fuck" + password);
	})


});



router.get('/About', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'About.html'));
});

router.get('/Modify', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'Modify.html'));
});

router.get('/GameTest', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'GameTest.html'));
});

router.get('/GameInterface', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'GameInterface.html'));
});

router.get('/SocketTest', function(req, res){
	res.sendFile(path.join(__dirname, '../', 'SocketTest.html'));
});


module.exports = router;
