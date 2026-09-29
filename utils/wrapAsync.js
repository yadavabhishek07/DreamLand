/**
 * wrapAsync Utility
 * Wraps asynchronous middleware or controller functions to catch any rejected promises
 * or errors, and automatically forwards them to the next error handling middleware.
 * Prevents repeating try-catch blocks everywhere.
 */
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);  
    };
};