"use strict";

const AppError = require("./AppError");

class ValidationError extends AppError {
    constructor(message) {
        super(message || "Not authorized to perform action.", 400);
    }
}

module.exports = ValidationError;