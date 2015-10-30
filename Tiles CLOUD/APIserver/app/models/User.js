/**
 * Created by Jonas on 29.10.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;//strength of encryption (10=default bcrypt value)

var MAX_LOGIN_ATTEMPTS = 7;
var LOCK_MIN_TIME = 5;//minutes
var LOCK_TIME = 60 * 1000 * LOCK_MIN_TIME;//ms

//user - crypt password
// @src: http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
/**
 * User Schema
 */
var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    email: {type: String},
    password: {type: String, required: true},
    loginAttempts: {type: Number, required: true, default: 0},
    lockUntil: {type: Number}
});


/**
 * Function run before a user is saved to db
 * to make sure the new password is stored encrypted
 * using brcypt
 */
UserSchema.pre('save', function (next) {
    var user = this;

    //hash password if modified
    if (!user.isModified('password'))
        return next();

    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
        if (error)
            return next(error);

        bcrypt.hash(user.password, salt, function (error, hash) {
            if (error)
                return next(error);
            user.password = hash;
            next();
        });
    });
});


/**
 * Virtual method, checking if a user account
 * is locked
 */
UserSchema.virtual('isLocked').get(function () {
    return !(this.lockUntil && this.lockUntil > Date.now());
});

//enum
var typeLogin = UserSchema.statics.failedLogin = {
    NOT_FOUND: 100,
    PASSWORD_INCORRECT: 101,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function (username, pw, callback) {
    this.findOne({username: username}, function (error, user) {
        if (error)
            return callback(error);

        if (!user)
            return callback, null, null, typeLogin.NOT_FOUND;
        if (user.isLocked) {
            return user.incrementLoginAttempts(function(err){
               //todo: continue here
            });
        }
    });
};


/**
 * Compare input password with stored hashed password
 * @param inputPW
 * @param next
 */
UserSchema.methods.comparePassword = function (inputPW, next) {
    bcrypt.compare(inputPW, this.password, function (error, isMatch) {
        if (error)
            return next(error);
        next(null, isMatch);
    });
};

UserSchema.methods.incrementLoginAttempts = function (callback) {
    //check if user can login again
    if (this.lockUntil && this.lockUntil < Date.now())
        return this.update({
            $set: {loginAttempts: 1},
            $unset: {lockUntil: 1}
        }, callback);

    var update = {$inc: {loginAttempts: 1}};

    //check if max login attempts is reached
    if (this.loginAttempts + 1 > MAX_LOGIN_ATTEMPTS && !this.isLocked)
        update.$set = {lockUntil: Date.now() + LOCK_TIME};

    return this.update(update,callback);
};


module.exports = mongoose.model('User', UserSchema);