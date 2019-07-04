const Schema = require('mongoose').Schema,
    bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

userSchema.methods.setPassword = function (newPassword) {
    return bcrypt.hash(newPassword, 10).then((hashedPassword) => {
        this.password = hashedPassword;
    });
};

userSchema.methods.comparePassword = function (newPassword) {
    return bcrypt.compare(newPassword, this.password);
};

module.exports = userSchema;