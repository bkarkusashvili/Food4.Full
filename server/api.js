const express = require('express');

const router = express.Router();

router.use('/admin', (req, res, next) => {
    if(!req.user || req.user.role !== 'admin')
        return res.status(401).send("Unauthorized");
});

router.use('/user', (req, res, next) => {
    if(!req.user)
        return res.status(401).send("Unauthorized");
    next();
});

module.exports = router;