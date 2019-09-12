const mongoose = require('mongoose'),
    mailer = require("../mailer");

function register(userParams) {
    return mongoose.model('User').find({ email: userParams.email }).countDocuments().then(function (count) {
        if (count > 0) {
            throw { taken: true };
        } else {
            let user = new mongoose.model('User')({
                name: userParams.name,
                unconfirmedEmail: userParams.email
            });

            if (userParams.password) {
                return user.setPassword(userParams.password).then(() => user.save());
            } else {
                return user.save();
            }
        }
    }).then(function (user) {
        generateAndSendConfirmationCode(user);
        return user;
    });
}

function generateAndSendConfirmationCode(user) {
    return mongoose.model('ConfirmationCode').generate({
        user: user._id,
        type: "email",
        email: user.unconfirmedEmail
    })
        .then((confirmationCode) => confirmationCode.save())
        .then((confirmationCode) => sendConfirmationCode(confirmationCode))
        .catch(err => console.error('Cannot send confirmation code', err));
}

function sendConfirmationCode(confirmationCode) {
    return mailer.sendMail({
        to: confirmationCode.email,
        subject: "ელ-ფოსტის დადასტურება",
        text: `გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა შემდეგ ლინკზე გადასვლით: https://food4.ge/login/confirm?code=${confirmationCode.code}`
    });
}

function confirmEmail(code) {
    return mongoose.model('ConfirmationCode')
        .findOne({
            code: code,
            type: "email"
        })
        .populate('user')
        .then(function (confirmationCode) {
            if (confirmationCode) {
                let user = confirmationCode.user;
                user.email = confirmationCode.email;
                user.unconfirmedEmail = null;
                confirmationCode.remove().catch(function (error) {
                    console.error("Error removing confirmation code", error);
                });
                return user.save().then(function () {
                    mongoose.model('User').deleteMany({ unconfirmedEmail: user.email, _id: { $ne: user._id } }).catch(function (err) {
                        console.error("Error removing unconfirmed users", err);
                    });
                    return user;
                });
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
                return user.setPassword(password).then(function () {
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
    resetPassword: resetPassword,
    generateAndSendConfirmationCode: generateAndSendConfirmationCode
};