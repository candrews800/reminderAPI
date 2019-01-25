const AppError = require("./AppError");

class NotAuthorizedError extends AppError {
    constructor(message) {
        super(message || "Not authorized to perform action.", 403);
    }
}

module.exports = NotAuthorizedError;