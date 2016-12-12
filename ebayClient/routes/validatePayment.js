/**
 * Created by Nikhil-PC on 12/11/2016.
 */

var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var log = require('./logger');

var checkValidCard = function(cardnum) {

    if (/[^0-9-\s]+/.test(cardnum)) return false;

    var numptr = 0, numdptr = 0, isPositionEven = false;
    cardnum = cardnum.replace(/\D/g, "");

    for (var n = cardnum.length - 1; n >= 0; n--) {
        var cDigit = cardnum.charAt(n),
            numdptr = parseInt(cDigit, 10);

        if (isPositionEven) {
            if ((numdptr *= 2) > 9) numdptr -= 9;
        }

        numptr += numdptr;
        isPositionEven = !isPositionEven;
    }

    return (numptr % 10) == 0;
};

var checkValidYear = function(month,year) {
    return ((month != 'Month') && (parseInt(year)>16));
};

var checkValidName = function(name){
    return ((name.length != 0));
};
var checkValidCvv = function(cvv){
    var reg = new RegExp('^[0-9]+$');
    if(/[^0-9\s]+/.test(cvv)) return  false;
    return (cvv.length == 3);
};

exports.checkout = function(req,res)
{
    res.render('payment', { title: 'Credit Card Info', cardnameerr:'',cardnumerr: '',invaliddate:'',invalidcvv:'' });
};

exports.validatePayment = function (req, res) {
    var isValidCreditCardNum = checkValidCard(req.body.cardnumber);
    var cardNumPrompt = '';
    if(!isValidCreditCardNum)
        cardNumPrompt = 'Invalid card number';
    var isValidYear = checkValidYear(req.body.expirymonth,req.body.expiryyear);
    var cardValidYEaPrompt = '';
    if(!isValidYear)
        cardValidYEaPrompt = 'Invalid year';
    var isValidName = checkValidName(req.body.cardholdername);
    var cardValidNAme = '';
    if(!isValidName)
        cardValidNAme = 'Invalid name';
    var isValidCVV = checkValidCvv(req.body.cvv);
    var cardValidCVV = '';
    if(!isValidCVV)
        cardValidCVV = 'Invalid CVV';

    if(!isValidCVV || !isValidName || !isValidYear || !isValidCreditCardNum )
    {
        //{ title: '', cardnameerr:'',cardnumerr: '',invaliddate:'',invalidcvv:'' }
        var prompt = new Object();
        prompt.title = "Your Card information ";
        prompt.cardnameerr = cardValidNAme;
        prompt.cardnumerr = cardNumPrompt;
        prompt.invaliddate = cardValidYEaPrompt;
        prompt.invalidcvv = cardValidCVV;
        res.render('payment', prompt );
    }
    else{
        var option =
        {
            ignoredNamespaces: true
        };
        var url = baseURL + "/paymentService?wsdl";

        soap.createClient(url, option, function (err, client) {
            var args = {};
            args.userid = req.session.userid;
            client.payment(args, function (err, results) {
                var data = JSON.parse(results.paymentReturn);
                log.info("POST ", "/payment ", " Called by ", req.session.userid, " at ", new Date().toLocaleString());
                console.log(data);
                if(data.statusCode === 200) {
                    res.render('allProducts', {err: ''});
                }else if(data.statusCode === 401){
                    res.render('allProducts', {err: 'Couldnt finish the payment'});
                }
            });
        });
    }
};
