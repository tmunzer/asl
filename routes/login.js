var express = require("express");
var router = express.Router();

router.get('/', function (req, res, next) {
        if (req.query.hasOwnProperty('Calling-Station-Id') &&
        req.query.hasOwnProperty('ssid') &&
        req.query.hasOwnProperty('STA-IP') &&
        req.query.hasOwnProperty('NAS-ID') &&
        req.query.hasOwnProperty('url') &&
        req.query.hasOwnProperty('NAS-IP-Address')) {
        // try to find the station into the UPA table (list all the station that have already accepted UPA)
            checkURI(req, function (params) {
                req.session.params = params;
                res.render("login");    
        })

    } 

})

function checkURI(req, callback){
    if (req.query['Calling-Station-Id'].length != 12) {
        console.log("Login Error: Calling-Station-Id");
        res.render("login_error");
    } else if (req.query['ssid'].length == 0) {
        console.log("Login Error: ssid");
        res.render("login_error");
    } else if (req.query['STA-IP'].length < 7 || req.query['STA-IP'].length > 15) {
        console.log("Login Error: STA-IP");
        res.render("login_error");
    } else if (req.query['NAS-ID'].length == 0) {
        console.log("Login Error: NAS-ID");
        res.render("login_error");
    } else if (req.query['url'].length == 0) {
        console.log("Login Error: url");
        res.render("login_error");
    } else if (req.query['NAS-IP-Address'].length < 7 || req.query['NAS-IP-Address'].length > 15) {
        console.log("Login Error: NAS-IP-Address");
        res.render("login_error");
    } else {
        var params = {
            callingStationId: req.query['Calling-Station-Id'],
            ssid: req.query['ssid'],
            staIp: req.query['STA-IP'],
            nasId: req.query['NAS-ID'],
            url: req.query['url'],
            nasIpAddress: req.query['NAS-IP-Address']
        };
        //if no error, got to login_upa
        callback(params);
    }
}

module.exports = router;
