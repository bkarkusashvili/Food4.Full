const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    router = express.Router(),
    middleware = require('@lib/middleware'),
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
router.use(middleware.noCache());

// Authorize access to Admin API
router.use('/admin', (req, res, next) => {
    if (!req.user || req.user.role !== 'admin')
        return res.status(401).send("Unauthorized");
    next();
});

// Authorize access to User API
router.use('/user', middleware.requireAuthenticated());

/*
* Public API
*/

// Settings
router.get('/settings', api.public.settings.default);

// Auth
router.post('/auth/login', api.public.auth.login);
router.post('/auth/logout', api.public.auth.logout);
router.get('/auth/me', api.public.auth.me);
router.post('/auth/reset', api.public.auth.reset);
router.post('/auth/forgot', api.public.auth.forgot);
router.get('/auth/check-email', api.public.auth.checkEmail);

// Posts
router.get('/posts', api.public.posts.index);
router.get('/posts/latest', api.public.posts.latest);
router.get('/posts/:id', api.public.posts.one);

// User recipes
router.post('/user-recipes', api.public.userRecipes.submit);

// Pages
router.get('/pages/:id', api.public.pages.one);

// Tags
router.get('/tags', api.public.tags.index);
router.get('/tagsAndPosts', api.public.tags.tagsAndPosts);
router.get('/tags/:id', api.public.tags.one);

// Users
router.get('/users/:id', api.public.users.one);
router.post('/users/register', api.public.users.register);
router.post('/users/confirm', api.public.users.confirm);
router.post('/users/requestCode', api.public.users.requestCode);

// Shop categories
router.get('/shop/categories', api.public.shop.categories.index);
router.get('/shop/categories/:id', api.public.shop.categories.one);

// Shop items
router.get('/shop/items', api.public.shop.items.index);
router.get('/shop/items/items', api.public.shop.items.index);
router.get('/shop/items/:id', api.public.shop.items.one);

router.get('/orders/callback', api.public.orders.callback);

/*
* User API
*/

router.put('/user/users/me', api.user.users.update);

// Favorites
router.get('/user/favorites', api.user.favorites.index);
router.get('/user/favorites/:postId', api.user.favorites.one);
router.post('/user/favorites/:postId', api.user.favorites.create);
router.delete('/user/favorites/:postId', api.user.favorites.remove);

// Cart
router.get('/user/cart', api.user.cart.index);
router.put('/user/cart', api.user.cart.update);

// Orders
router.get('/user/orders', api.user.orders.index);
router.get('/user/orders/:id', api.user.orders.one);
router.put('/user/orders/:id', api.user.orders.update);
router.post('/user/orders', api.user.orders.create);
router.put('/user/orders/:id/pay', api.user.orders.pay);
router.put('/user/orders/:id/cancel', api.user.orders.cancel);
router.put('/user/orders/:id/check', api.user.orders.check);

/*
* Admin API
*/

// Posts
router.get('/admin/posts', api.admin.posts.index);
router.get('/admin/posts/:id', api.admin.posts.one);
router.post('/admin/posts', api.admin.posts.create);
router.put('/admin/posts/:id', api.admin.posts.update);
router.delete('/admin/posts/:id', api.admin.posts.remove);

// User recipes
router.get('/admin/user-recipes', api.admin.userRecipes.index);
router.get('/admin/user-recipes/:id', api.admin.userRecipes.one);
router.put('/admin/user-recipes/:id', api.admin.userRecipes.update);
router.post('/admin/user-recipes/:id/publish', api.admin.userRecipes.publish);
router.delete('/admin/user-recipes/:id', api.admin.userRecipes.remove);

// Pages
router.get('/admin/pages', api.admin.pages.index);
router.get('/admin/pages/:id', api.admin.pages.one);
router.post('/admin/pages', api.admin.pages.create);
router.put('/admin/pages/:id', api.admin.pages.update);
router.delete('/admin/pages/:id', api.admin.pages.remove);

// Settings
router.get('/admin/settings', api.admin.settings.default);
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

// Shop categories
router.get('/admin/shop/categories', api.admin.shop.categories.index);
router.post('/admin/shop/categories', api.admin.shop.categories.create);
router.put('/admin/shop/categories/:id', api.admin.shop.categories.update);
router.delete('/admin/shop/categories/:id', api.admin.shop.categories.remove);

// Shop items
router.get('/admin/shop/items', api.admin.shop.items.index);
router.post('/admin/shop/items', api.admin.shop.items.create);
router.get('/admin/shop/items/:id', api.admin.shop.items.one);
router.put('/admin/shop/items/:id', api.admin.shop.items.update);
router.delete('/admin/shop/items/:id', api.admin.shop.items.remove);

// Shop orders
router.get('/admin/shop/orders', api.admin.shop.orders.index);
router.get('/admin/shop/orders/:id', api.admin.shop.orders.one);
router.put('/admin/shop/orders/:id', api.admin.shop.orders.update);
router.put('/admin/shop/orders/:id/status', api.admin.shop.orders.setStatus);
router.post('/admin/shop/orders/:id/cancel', api.admin.shop.orders.cancel);
router.post('/admin/shop/orders/:id/check', api.admin.shop.orders.check);

router.use(middleware.handleError());

module.exports = router;