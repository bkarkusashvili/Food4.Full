const Schema = require('mongoose').Schema,
    bcrypt = require('bcrypt');

const schema = new Schema({
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
    addresses: [new Schema({
        line1: String,
        line2: String,
        zip: String,
        city: String,
        province: String,
        country: String,
        phone: String,
        location: [Schema.Types.Number],
        default: Boolean
    })]
}, { timestamps: true, toJSON: { virtuals: true } });

schema.index({ '$**': 'text' });

schema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    justOne: false,
    options: { sort: { publishedAt: -1 }, limit: 10, projection: { content: 0 } }
});

schema.virtual('cart', {
    ref: 'ShopCart',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
    options: {  }
});

schema.methods.setPassword = function (newPassword) {
    return bcrypt.hash(newPassword, 10).then((hashedPassword) => {
        this.password = hashedPassword;
    });
};

schema.methods.comparePassword = function (newPassword) {
    return bcrypt.compare(newPassword, this.password);
};

module.exports = schema;