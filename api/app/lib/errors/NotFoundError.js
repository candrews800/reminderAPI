"use strict";

const AppError = require("./AppError");

const STATUS_CODE = 404;

class NotFoundError extends AppError {
    constructor(message) {
        super(message || "Could not find resource.", STATUS_CODE);
    }

    getStatusCode() {
        return STATUS_CODE;
    }
}

module.exports = NotFoundError;