const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    router = express.Router(),
    api = scanDir(__dirname, true);

// Find and register all API handlers
function scanDir(dirPath, dirsOnly) {
    return fs.readdirSync(dirPath, { withFileTypes: true }).reduce((apiMap, dirent) => {
        // Do not follow symbolic links
        if (dirent.isSymbolicLink()) return apiMap;

        // Scan recursively
        if (dirent.isDirectory()) {
            apiMap[dirent.name] = scanDir(path.join(dirPath, dirent.name));
        } else if (path.extname(dirent.name) === '.js') {
            if (dirsOnly) return apiMap;
            apiMap[path.basename(dirent.name, '.js')] = require(path.join(dirPath, dirent.name));
        }

        return apiMap;
    }, {});
}

// Disable cache
router.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

// Authorize access to Admin API
router.use('/admin', (req, res, next) => {
    if (!req.user || req.user.role !== 'admin')
        return res.status(401).send("Unauthorized");
    next();
});

// Authorize access to User API
router.use('/user', (req, res, next) => {
    if (!req.user)
        return res.status(401).send("Unauthorized");
    next();
});

/*
* Public API
*/

// Auth
router.post('/auth/login', api.public.auth.login);
router.post('/auth/logout', api.public.auth.logout);
router.get('/auth/me', api.public.auth.me);
router.post('/auth/reset', api.public.auth.reset);
router.get('/auth/check-email', api.public.auth.checkEmail);

// Posts
router.get('/posts', api.public.posts.index);
router.get('/posts/latest', api.public.posts.latest);
router.get('/posts/:id', api.public.posts.one);

// Pages
router.get('/pages/:id', api.public.pages.one);

// Tags
router.get('/tags', api.public.tags.index);
router.get('/tagsAndPosts', api.public.tags.tagsAndPosts);
router.get('/tags/:id', api.public.tags.one);

// Users
router.post('/users/register', api.public.users.register);
router.post('/users/confirm', api.public.users.confirm);
router.post('/users/requestCode', api.public.users.requestCode);

/*
* User API
*/

// Favorites
router.get('/user/favorites', api.user.favorites.index);
router.get('/user/favorites/:postId', api.user.favorites.one);
router.post('/user/favorites/:postId', api.user.favorites.create);
router.delete('/user/favorites/:postId', api.user.favorites.remove);

/*
* Admin API
*/

// Posts
router.get('/admin/posts', api.admin.posts.index);
router.get('/admin/posts/:id', api.admin.posts.one);
router.post('/admin/posts', api.admin.posts.create);
router.put('/admin/posts/:id', api.admin.posts.update);
router.delete('/admin/posts/:id', api.admin.posts.remove);

// Pages
router.get('/admin/pages', api.admin.pages.index);
router.get('/admin/pages/:id', api.admin.pages.one);
router.post('/admin/pages', api.admin.pages.create);
router.put('/admin/pages/:id', api.admin.pages.update);
router.delete('/admin/pages/:id', api.admin.pages.remove);

// Settings
router.put('/admin/settings', api.admin.settings.update);

// Files
router.get('/admin/files', api.admin.files.index);
router.get('/admin/files/:id', api.admin.files.one);
router.post('/admin/files', api.admin.files.upload);
router.put('/admin/files/:id', api.admin.files.update);
router.delete('/admin/files/:id', api.admin.files.remove);

// Tags
router.get('/admin/tags', api.admin.tags.index);
router.post('/admin/tags', api.admin.tags.create);
router.put('/admin/tags/:id', api.admin.tags.update);
router.delete('/admin/tags/:id', api.admin.tags.remove);

// Users
router.get('/admin/users', api.admin.users.index);
router.get('/admin/users/:id', api.admin.users.one);
router.post('/admin/users', api.admin.users.create);
router.put('/admin/users/:id', api.admin.users.update);
router.delete('/admin/users/:id', api.admin.users.remove);

module.exports = router;