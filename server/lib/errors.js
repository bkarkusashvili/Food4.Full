const ERROR_CODE = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
}

class ApiError extends Error {
    code
    log

    constructor(message = "Internal server error", code = ERROR_CODE.SERVER_ERROR, log = true) {
        super(message);

        this.code = code;
        this.log = log;
    }

    static fromError(error, log = true) {
        if (error instanceof ApiError)
            return error;

        return new this(error.message, undefined, log);
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message
        }
    }
}

class NotFoundError extends ApiError {
    constructor(message = "The requested resource or action does not exist", code = ERROR_CODE.NOT_FOUND, log = false) {
        super(message, code, log);
    }
}

class ClientError extends ApiError {
    constructor(message, code = ERROR_CODE.BAD_REQUEST, log = false) {
        super(message, code, log);
    }
}

class ValidationError extends ClientError {
    details

    constructor(message, details) {
        super(message, ERROR_CODE.BAD_REQUEST);
        this.details = details;
    }

    static fromJoi(error) {
        return new this(error.message, error.details.map((item) => ({ message: item.message, field: item.path.join('/') })));
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            details: this.details
        }
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "You are not authorized to perform this action.", code = ERROR_CODE.UNAUTHORIZED, log = false) {
        super(message, code, log);
    }
}

module.exports = { ApiError, ClientError, UnauthorizedError, ValidationError, NotFoundError }