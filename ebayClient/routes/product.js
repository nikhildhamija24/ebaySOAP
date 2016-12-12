/**
 * Created by Nikhil-PC on 12/10/2016.
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var log = require('./logger');

exports.productDetails = function (req, res) {
    res.render('productDetails', function (err, data) {
        if(err){
            console.error(err);
        }else{
            log.info("GET ","/product ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            res.send(data);
        }
    });
};

exports.allProducts = function (req, res) {
    res.render('allProducts', function (err, data) {
        if(err){
            console.error(err);
        }else{
            log.info("GET ","/allProds ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            res.send(data);
        }
    });
};

exports.addProduct = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/productService?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        //int userid, String itemName, String itemDescription, int itemQuantity, int itemPrice, String sellerName, String bidding
        args.userid = req.session.userid;
        // args.userid = 11;
        args.itemName = req.body.title;
        args.itemDescription = req.body.description;
        args.itemQuantity = req.body.quantity;
        args.itemPrice = req.body.price;
        // args.sellerName = req.session.username;
        args.sellerName = 'nikhil';
        args.bidding = req.body.bidding;

        client.addProduct(args, function (err, results) {
            var data = JSON.parse(results.addProductReturn);
            console.log(data);
            res.send(data);
        });
    });
};

exports.getAllProducts = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/productService?wsdl";

    soap.createClient(url, option, function (err, client) {
        var args = {};
        // args.userid = 11;
        args.userid = req.session.userid;
        client.getAllProducts(args, function (err, results) {
            var data = JSON.parse(results.getAllProductsReturn);
            console.log(data);
            res.send(data);
        });
    });
};

exports.addToBid = function (req, res) {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/productService?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        // args.userid = 11;
        args.userid = req.session.userid;
        args.productid = req.param("productid");
        args.bidamount = parseFloat(req.param("itemprice")) + parseFloat(req.param("userbid"));
        args.selectedquantity = parseInt(req.param("selectedquantity"))+1;
        client.addToBid(args, function (err, results) {
            var data = JSON.parse(results.addToBidReturn);
            console.log(data);
            res.send(data);
        });
    });
};