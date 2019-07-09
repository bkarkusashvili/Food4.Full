module.exports = {
    admin: {
        defaultAdmin: {
            username: 'admin',
            password: 'admin',
            role: 'admin'
        }
    },
    mongoose: {
        url: "mongodb://localhost/food4"
    },
    session: {
        secret: 'ajapsandali',
        collection: 'session'
    }
};