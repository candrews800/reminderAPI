"use strict";

class AppError extends Error {
    constructor (message, status) {
        super(message);

        this.name = this.constructor.name;

        this.status = status || 500;
    }
}

module.exports = AppError;