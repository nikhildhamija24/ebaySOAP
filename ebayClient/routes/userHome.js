/**
 * Created by Nikhil-PC on 12/10/2016.
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var log = require('./logger');

exports.getUserProfile = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/userhome?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        // args.userid = 11;
        args.userid = req.session.userid;
        client.getUserProfile(args, function (err, results) {
            log.info("GET ","/userProfile ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            var data = JSON.parse(results.getUserProfileReturn);
            console.log(data);
            res.send(data);
        });
    });
};

exports.updateUserProfile = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/userhome?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        // args.userid = 11;
        args.userid = req.session.userid;
        args.userbday = req.body.userbday;
        args.ebayhandle = req.body.ebayhandle;
        args.location = req.body.location;
        args.contact = req.body.contact;
        client.updateUserProfile(args, function (err, results) {
            var data = JSON.parse(results.updateUserProfileReturn);
            log.info("POST ", "/userUpdate ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            console.log(data);
            res.send(data);
        });
    });
};
