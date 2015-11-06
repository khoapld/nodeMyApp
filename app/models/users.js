var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [5, 255],
                message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
            }),
            validate({
                validator: 'isEmail',
                message: 'Email is not correct'
            })
        ]
    },
    password: {
        type: String,
        required: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [5],
                message: 'Password should be rather than {ARGS[0]} characters'
            })
        ]
    },
    is_actived: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
}, {collection: 'users'});

// Pre hook for `save`
UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
        return next();

    // hash password
    user.password = user.hashPW(user.password);
    next();
});

// Pre hook for `findOneAndUpdate`
UserSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

UserSchema.methods.hashPW = function (pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64').toString();
};

User = mongoose.model('User', UserSchema);
module.exports = User;

User.schema.path('username').validate(function (value, respond) {
    User.findOne({username: value}, function (err, user) {
        if (err)
            throw err;
        if (user)
            respond(false);
        respond(true);
    });
}, 'This username is already registered');

User.schema.path('email').validate(function (value, respond) {
    User.findOne({email: value}, function (err, user) {
        if (err)
            throw err;
        if (user)
            respond(false);
        respond(true);
    });
}, 'This email address is already registered');
