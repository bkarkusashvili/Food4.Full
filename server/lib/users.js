const mongoose = require('mongoose');

function register(userParams) {

}

function confirmEmail(code) {
    return mongoose.model('ConfirmationCode')
        .findOne({
            code: code,
            type: "email"
        })
        .lean()
        .populate('user')
        .then(function (confirmationCode) {
            if (confirmationCode) {
                let user = confirmationCode.user;
                user.email = confirmationCode.email;
                delete user.unconfirmedEmail;
                confirmationCode.remove().catch(function (error) {
                    console.error("Error removing confirmation code", error);
                });
                return user.save();
            }
        });
}

function resetPassword(code, password) {
    return mongoose.model('ConfirmationCode')
        .findOne({
            code: code,
            type: "email"
        })
        .populate('user')
        .then(function (confirmationCode) {
            if (confirmationCode) {
                let user = confirmationCode.user;
                confirmationCode.remove().catch(function (error) {
                    console.error("Error removing confirmation code", error);
                });
                return user.setPassword(password).then(function(){
                    return user.save();
                });
            }
        });
}

function confirmPhone(user, code) {

}

module.exports = {
    register: register,
    confirmEmail: confirmEmail,
    resetPassword: resetPassword
};