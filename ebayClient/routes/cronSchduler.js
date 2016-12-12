/**
 * Created by Nikhil-PC on 12/11/2016.
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayServices/services";
var CronJob = require('cron').CronJob;

var job = new CronJob('10 * * * * *', function () {
    var option =
    {
        ignoredNamespaces: true
    };
    var url = baseURL + "/bidScheduler?wsdl";
    soap.createClient(url, option, function (err, client) {
        var args = {};
        client.bid(args, function (err, results) {
            
        });
    });
}, null, true, 'America/Los_Angeles');