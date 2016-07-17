var https = require('https');
var redirectUrl = require(appRoot + "/bin/aerohive/config").redirectUrl;
var secret = require(appRoot + "/bin/aerohive/config").secret;
var clientId = require(appRoot + "/bin/aerohive/config").clientId;

module.exports.getPermanentToken = function(authCode, callback){
    var options = {
        host: 'cloud.aerohive.com',
        port: 443,
        path: '/services/acct/thirdparty/accesstoken?authCode='+authCode+'&redirectUri='+redirectUrl,
        method: 'POST',
        headers: {
            'X-AH-API-CLIENT-SECRET' : secret,
            'X-AH-API-CLIENT-ID':clientId,
            'X-AH-API-CLIENT-REDIRECT-URI': redirectUrl
        }
    };

    var req = https.request(options, function(res) {
        console.info('STATUS: ' + res.statusCode);
        console.info('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (data) {
            callback(JSON.parse(data));
        });
    });

    req.on('error', function(err) {
        callback(err);
    });

// write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
};

