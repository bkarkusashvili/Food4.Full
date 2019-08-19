const mongoose = require('mongoose');

function register(userParams) {

}

function confirmEmail(code) {
    return mongoose.model('ConfirmationCode')
        .findOne({
            code: code,
            type: "email"
        })
        .populate('user')
        .lean()
        .then(function (confirmationCode) {
            if (confirmationCode) {
                let user = confirmationCode.user;
                user.email = user.unconfirmedEmail;
                confirmationCode.remove().catch(function (error) {
                    console.error("Error removing confirmation code", error);
                });
                return confirmationCode.user.save();
            }
        });
}



function confirmPhone(user, code) {

}

module.exports = {
    register: register,
    confirmEmail: confirmEmail
};