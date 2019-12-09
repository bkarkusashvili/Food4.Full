const users = require('@lib/users');

module.exports = function (req, res) {
    const id = req.params.id;
    let params = {};

    if (req.body.defaultAddress != null)
        params.defaultAddress = req.body.defaultAddress;
    if (req.body.addresses != null)
        params.addresses = req.body.addresses;
    if (req.body.name != null)
        params.name = req.body.name;
    if (req.body.password != null)
        params.password = req.body.password;

    users.updateProfile(id, params).then(function (user) {
        if (user)
            res.json(user);
        else
            res.status(404).send("User not found!");
    }).catch((error) => res.status(500).json(error));
    
};