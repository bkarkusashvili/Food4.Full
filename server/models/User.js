const Schema = require('mongoose').Schema,
    bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String
    },
    unconfirmedEmail: {
        type: String
    },
    phone: {
        type: String
    },
    unconfirmedPhone: {
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    addresses: [ new Schema({
        line1: String,
        line2: String,
        zip: String,
        city: String,
        province: String,
        country: String,
        phone: String,
        location: [ Schema.Types.Number ],
        default: Boolean
    }) ]
}, { timestamps: true });

userSchema.methods.setPassword = function (newPassword) {
    return bcrypt.hash(newPassword, 10).then((hashedPassword) => {
        this.password = hashedPassword;
    });
};

userSchema.methods.comparePassword = function (newPassword) {
    return bcrypt.compare(newPassword, this.password);
};

module.exports = userSchema;