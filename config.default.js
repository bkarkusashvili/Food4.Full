module.exports = {
    admin: {
        defaultAdmin: {
            email: 'admin@food4.ge',
            password: 'admin',
            role: 'admin',
            verified: true,
            name: 'Admin'
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