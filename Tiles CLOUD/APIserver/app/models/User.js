/**
 * Created by Jonas on 29.10.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//user - crypt password
// @src: http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    email: {type: String},
    password: {type: String, required: true}
});

UserSchema.pre(save, function (next) {
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
 * Compare input password with stored hashed password
 * @param inputPW
 * @param next
 */
UserSchema.methods.comparePassword = function (inputPW, next) {
    bcrypt.compare(inputPW, this.password, function (error, isMatch) {
        if (error)
            return next(error);
        next(null,isMatch);
    });
};

module.exports = mongoose.model('User',UserSchema);