const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    router = express.Router(),
    api = scanDir(__dirname, true);

function scanDir(dirPath, dirsOnly) {
    return fs.readdirSync(dirPath, { withFileTypes: true }).reduce((apiMap, dirent) => {
        if (dirent.isSymbolicLink()) return apiMap;

        if (dirent.isDirectory()) {
            apiMap[dirent.name] = scanDir(path.join(dirPath, dirent.name));
        } else if (path.extname(dirent.name) === '.js') {
            if (dirsOnly) return apiMap;
            apiMap[path.basename(dirent.name, '.js')] = require(path.join(dirPath, dirent.name));
        }

        return apiMap;
    }, {});
}

router.use('/admin', (req, res, next) => {
    if (!req.user || req.user.role !== 'admin')
        return res.status(401).send("Unauthorized");
    next();
});

router.use('/user', (req, res, next) => {
    if (!req.user)
        return res.status(401).send("Unauthorized");
    next();
});

router.post('/auth/login', api.auth.login);
router.post('/auth/logout', api.auth.logout);
router.get('/auth/me', api.auth.me);

router.get('/admin/posts', api.admin.posts.index);
router.post('/admin/posts', api.admin.posts.create);

router.get('/admin/tags', api.admin.tags.index);
router.post('/admin/tags', api.admin.tags.create);
router.delete('/admin/tags', api.admin.tags.remove);

router.get('/admin/users', api.admin.users.index);
router.post('/admin/users', api.admin.users.create);

module.exports = router;