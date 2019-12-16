const consola = require('consola'),
    { ApiError, UnauthorizedError } = require('@lib/errors');

module.exports = {
    asyncController(controller) {
        return async (req, res, next) => {
            try {
                await controller(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    },

    cors() {
        return (req, res, next) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', '*');
            res.set('Access-Control-Expose-Headers', '*');
            res.set('Access-Control-Allow-Methods', '*');

            if (req.method === "OPTIONS") {
                return res.status(200).end();
            }

            next();
        }
    },

    noCache() {
        return (_req, res, next) => {
            res.set('Cache-Control', 'no-store');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            next();
        }
    },

    handleError() {
        return (err, _req, res, _next) => {
            if (err instanceof Error && !(err instanceof ApiError)) {
                consola.error("Unexpected error:", err);
                err = ApiError.fromError(err, false);
            }

            if (err instanceof ApiError) {
                if (err.log)
                    consola.error(err);
                return res.status(err.code).json(err);
            }

            res.status(500).json(err);
        }
    },

    requireAuthenticated() {
        return (req, res, next) => {
            if (req.method === "OPTIONS")
                return res.status(200).end;
            if (req.user) return next();

            return next(new UnauthorizedError());
        }
    }
}
