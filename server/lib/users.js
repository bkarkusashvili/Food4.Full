const mongoose = require('mongoose'),
    mailer = require("@root/mailer");

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
    let confirmationUrl = `https://food4.ge/login/confirm?code=${confirmationCode.code}`;
    return mailer.sendTemplated('email-confirmation', {
        confirmationUrl: confirmationUrl
    }, {
        to: confirmationCode.email,
        subject: "ელ-ფოსტის დადასტურება - FOOD4.GE",
        text: `გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა შემდეგ ლინკზე გადასვლით: ${confirmationUrl}`
    });
}

function confirmEmail(code) {
    return mongoose.model('ConfirmationCode')
        .findOne({
            code: code,
            type: "email"
        })
        .then(function (confirmationCode) {
            if (confirmationCode) {
                let userId = confirmationCode.user,
                    email = confirmationCode.email;
                confirmationCode.remove().catch(function (error) {
                    console.error("Error removing confirmation code", error);
                });

                return mongoose.model('User').findByIdAndUpdate(userId, {
                    email: email,
                    unconfirmedEmail: null
                }).then(function (user) {
                    mongoose.model('User').deleteMany({ unconfirmedEmail: email, _id: { $ne: userId } }).catch(function (err) {
                        console.error("Error removing unconfirmed users", err);
                    });
                    return user;
                });
            }
        });
}

function forgotPassword(email) {
    return mongoose.model('User').findOne({ email: email }).then((user) => {
        if (user)
            return generateAndSendResetCode(user);
    });
}

function generateAndSendResetCode(user) {
    return mongoose.model('ConfirmationCode').generate({
        user: user._id,
        type: "password",
        email: user.email
    })
        .then((confirmationCode) => confirmationCode.save())
        .then((confirmationCode) => sendResetCode(confirmationCode))
        .catch(err => console.error('Cannot send reset code', err));
}

function sendResetCode(confirmationCode) {
    let resetUrl = `https://food4.ge/login/reset?code=${confirmationCode.code}`;
    return mailer.sendTemplated('password-reset', {
        resetUrl: resetUrl
    }, {
        to: confirmationCode.email,
        subject: "პაროლის აღდგენა - FOOD4.GE",
        text: `შეგიძლიათ შეცვალოთ თქვენი პაროლი შემდეგ ლინკზე გადასვლით: ${resetUrl}`
    });
}

function resetPassword(code, password) {
    return mongoose.model('ConfirmationCode')
        .findOne({
            code: code,
            type: "password"
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

async function updateProfile(id, params) {
    let user = await mongoose.model('User').findById(id);
    if (!user) return;
    Object.assign(user, params);
    if (params.password)
        await user.setPassword(params.password);
    return user.save();
}

function confirmPhone(user, code) {

}

module.exports = {
    register: register,
    confirmEmail: confirmEmail,
    resetPassword: resetPassword,
    updateProfile: updateProfile,
    generateAndSendConfirmationCode: generateAndSendConfirmationCode,
    forgotPassword: forgotPassword,
};