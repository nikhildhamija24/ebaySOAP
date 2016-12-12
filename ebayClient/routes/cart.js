/**
 * Created by Nikhil-PC on 12/11/2016.
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var log = require('./logger');

exports.getCartPage = function (req, res) {
    log.info("GET ","/cartPage ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
    res.render('shoppingCart');
};
exports.addToCart = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/cartService?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        args.userid = req.session.userid;
        args.productid = req.param("productId");
        args.itemprice = parseFloat(req.param("itemprice"));
        args.selectquantity = parseInt(req.param("selectedQuantity"))+1;

        client.addToCart(args, function (err, results) {
            var data = JSON.parse(results.addToCartReturn);
            console.log(data);
            // res.send(data);
            res.end();
        });
    });
};

exports.getTheCart = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/cartService?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        args.userid = req.session.userid;
        client.getTheCart(args, function (err, results) {
            var data = JSON.parse(results.getTheCartReturn);
            log.info("GET ","/getCart ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            console.log(data);
            res.send(data);
            res.end();
        });
    });
};

exports.deleteFromCart = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/cartService?wsdl";
    soap.createClient(url, option, function (err, client) {
        log.info("POST ","/deleteFromCart ", "by ", req.session.userid, " deleted ", prodId, " called at ", new Date().toLocaleString());
        var args = {};
        args.productid = req.body.productId;
        args.selectedquantity = req.body.selectedQuantity;
        args.userid = req.session.userid;
        client.deleteFromCart(args, function (err, results) {
            var data = JSON.parse(results.deleteFromCartReturn);
            console.log(data);
            res.send(data);
            res.end();
        });
    });
};
