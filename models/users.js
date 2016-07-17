var mongoose = require('mongoose');
var Api = require("./../bin/aerohive/api/main");
var config = require("./../config");

function capitalize (val){
    if (typeof val !== 'string') val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var UserSchema = new mongoose.Schema({
    userId:  Number,
    password: String,
    name:  String,
    email: String,
    gender: String,
    location: String,
    provider:  String,
    lastLogin: Date,
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var User = mongoose.model('User', UserSchema);

User.newLogin = function(email, password, callback){
    this.findOne({email: email})
        .exec(function(err, user){
        if (err) callback(err, null);
        else if  (!user) callback(null, false);
        else callback(null, user);
    })
};

User.findByEmail = function(email, callback){
    this.findOne({email: email}, callback);
};
User.findById = function(id, callback){
    this.findOne({_id: id}, callback);
};
User.findByUserId = function(id, callback){
    this.findOne({userId: id}, callback);
};
// Pre save
UserSchema.pre('save', function(next) {
    var now = new Date();
    var account = this;
    account.updated_at = now;
    if ( !account.created_at ) {
        account.created_at = now;
    }
    if ( !account.password ) {
        createPassword(account, function (test) {
            account = test;
            next();
        });
    } else next();
});
    
function createPassword(account, callback) {
    console.log("haha!");
          Api.identity.credentials.createCredential(
            config.aerohive,
            null,
            null, 
            {  
                "deliverMethod": "NO_DELIVERY",
                "firstName": account.userId,
                "groupId": config.aerohive.groupId,
                "policy": "GUEST",
                "organization": account.provider,
                "purpose": "Social Login"
            },
            function (err, credential) {    
                // if the account already exists on ACS
                if (err && err.code == "registration.service.item.already.exist") {
                    Api.identity.credentials.getCredentials(
                        config.aerohive, 
                        null, null, null, null, null,
                        account.userId,
                        null, null, null, null, null, null,
                        function (err, oldCredential) {
                            Api.identity.credentials.deleteCredential(
                            config.aerohive, 
                            null,
                            null,
                            oldCredential[0].id,
                            function (err) {
                                if (err) console.log(err);
                                createPassword(account, function (newAccount) {
                                    callback(newAccount);
                                })                            
                            })
                        }) 
                } else {
                    account.password = credential.password;
                    callback(account);
                }
            }
        );
}


User.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({userId : profile.id, provider: profile.provider},function(err,result){ 
        if (!result) {
            if (profile.provider == "facebook") {
                userObj.provider = "facebook";
                userObj.userId = profile._json.id;
                userObj.name = profile._json.name;
                userObj.email = profile._json.email;
            } else if (profile.provider == "google") {
                userObj.provider = "google";
                userObj.userId = profile._json.id;
                userObj.name = profile._json.displayName;
                userObj.gender = profile._json.gender;
            } else if (profile.provider == "twitter") {
                userObj.provider = "twitter";
                userObj.userId = profile._json.id;
                userObj.name = profile._json.screen_name;
                userObj.location = profile._json.location;
            }
            userObj.created_at = new Date();
            userObj.updated_at = new Date();
            userObj.save(function (err, result) {
                cb(err, result)
            });
        } else if (!result.password) {
            result.save(function (err, result) {
                cb(err, result);
            });    
        } else {
            cb(err,result);
        }
    });
};

module.exports = User;