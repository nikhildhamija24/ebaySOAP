/**
 * Created by Nikhil-PC on 12/08/2016.
 */
// var express = require('express');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var bcrypt = require('bcryptjs');

var log = require('./logger');
//http://localhost:8080/ebayServices/services/validateLogin
exports.getSignInPage = function(req, res) {
    res.render('signin', function (err, data) {
        if(err){
            console.error(err);
        }else{
            res.end(data);
        }
    });
};

exports.checkLogin = function(req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/validateLogin?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        args.username = req.body.userEmail;
        var pass = req.body.userPassword;

        // args.userPassword = "$2a$10$eiAmV4h.0GUBB0DKoDKM/OEBKAQz8Bz4D4awGtUStyPzmQfnLIiZi";
        // args.userPassword = hash;
        console.log(JSON.stringify(args));
        client.validate(args, function (err, results) {
            //validateReturn
            var data = JSON.parse(results.validateReturn);
            console.log(data);
            var password = data.userProfile[0].password;
            if(bcrypt.compareSync(req.body.userPassword, password)){
                req.session.userid = data.userProfile[0].userid;
                req.session.username = data.userProfile[0].firstname;
                req.session.useremail = data.userProfile[0].email;
                req.session.loginTime = new Date().toLocaleString();

                res.send({code : 200});
            }else{
                res.send({code : 401});
            }

        });
    });
};

exports.getUsername = function (req, res) {
    var obj = new Object();
    obj.user = req.session.username;
    obj.lastLogin = req.session.loginTime;
    res.send(obj);
};

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');
};