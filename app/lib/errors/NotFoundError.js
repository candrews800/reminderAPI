const AppError = require("./AppError");

class NotFoundError extends AppError {
    constructor(message) {
        super(message || "Could not find resource.", 404);
    }
}

module.exports = NotFoundError;