/**
 * Created by Nikhil-PC on 12/10/2016.
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var bcrypt = require('bcryptjs');
exports.getRegisterPage = function(req, res){
    res.render('register', function (err,data) {
        if(err){
            console.error(err);
        } else{
            res.send(data);
        }
    });
};

exports.signup = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/validateLogin?wsdl";

    soap.createClient(url, option, function (err, client) {
        var args = {};
        var pass = req.body.pass;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(pass, salt);
        console.log(hash);
        args.username = req.body.registeremail;
        args.fname = req.body.fname;
        args.lname = req.body.lname;
        args.password = hash;
        //register(String username, String fname, String lname, String password)
        //registerReturn
        client.register(args, function (err, results) {
            var data = JSON.parse(results.registerReturn);
            console.log(data);
            res.send(data);
        });
    });
};