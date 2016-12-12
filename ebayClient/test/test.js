/**
 * Created by Nikhil-PC on 12/11/2016.
 */
var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
//productService
var option = {
    ignoredNamespaces : true
};

describe('testing ebay', function(){

    it('should successfully update the user details', function(done){
        var url = baseURL+"/userhome?wsdl";
        var input = {};
        input.userid = 8;
        input.userbday = '09/24/2016';
        input.ebayhandle = 'nikhil24';
        input.location = 'san jose';
        input.contact = '562391665';
        soap.createClient(url,option, function(err, client) {
            client.updateUserProfile(input, function(err, data) {
                console.log('update user' + data.updateUserProfileReturn);
                assert.notEqual(data.updateUserProfileReturn, null);
                done();
            });
        });
    });

    it('should signup the user to the system', function(done){
        var url = baseURL+"/validateLogin?wsdl";
        soap.createClient(url, option, function(err, client) {
            var arg = {};
            arg.username = 'Nikd@gmail.com';
            arg.fname = 'Nik';
            arg.lname = 'Dhamija';
            arg.password = 'ebayDemo';
            client.register(arg, function(err, result) {
                assert.notEqual(result.registerReturn, null);
                done();
            });
        });
    });

    it('should return the home page if the url is correct', function(done){
        http.get('http://localhost:3000', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });
    it('should not return the signin page if the url is wrong', function(done){
        http.get('http://localhost:3000/signinPage', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should succesfully signin the user', function(done) {
        request.post(
            'http://localhost:3000/signin',
            { form: { userEmail:'nikhil.dhamija@sjsu.edu',userPassword:'qwerty123' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});
