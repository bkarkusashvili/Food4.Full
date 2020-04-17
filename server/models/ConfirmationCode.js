const Schema = require('mongoose').Schema,
    crypto = require('crypto');

const schema = new Schema({
    type: {
        type: String,
        enum: ["phone", "email", "password"]
    },
    code: {
        type: String
    },
    expires: {
        type: Date,
        expires: 0
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

schema.static('generateCode', function () {
    return new Promise((resolve, reject) => crypto.randomBytes(48, function (err, buffer) {
        if (err)
            return reject(err);
        resolve(buffer.toString('hex'));
    }));
});

schema.static('generate', function (params) {
    return new Promise((resolve, reject) => crypto.randomBytes(12, (err, buffer) => {
        if (err)
            return reject(err);
        let confirmationCode = new this(params);
        confirmationCode.code = buffer.toString('hex');
        resolve(confirmationCode);
    }));
});

module.exports = schema;