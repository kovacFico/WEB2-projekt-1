const {
    InvalidTokenError,
    UnauthorizedError,
} = require("express-oauth2-jwt-bearer");

const errorHandler = (error, request, response, next) => {
    if (error instanceof InvalidTokenError) {
        const message = "Bad credentials";
        const status = 401
        response.status(status).json({ message });

        return;
    }

    if (error instanceof UnauthorizedError) {
        const message = "Requires authentication";
        const status = 401
        response.status(status).json({ message });

        return;
    }

    const status = 500;
    const message = "Internal Server Error";
    response.status(status).json({ message });
};

module.exports = {
    errorHandler,
};