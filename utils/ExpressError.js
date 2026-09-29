/**
 * ExpressError class
 * Custom Error class that extends standard JavaScript Error.
 * Allows attaching a custom HTTP statusCode along with the error message
 * so we can respond to client requests with appropriate status codes (like 404, 400).
 */
class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;