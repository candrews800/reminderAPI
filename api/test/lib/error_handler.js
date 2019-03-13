const assert = require("assert");

const errorHandler = require("app/lib/error_handler");

const NotFoundError = require("app/lib/errors/NotFoundError");

const getDefaultReq = () => {
    return {
        params: {}
    };
};

const getDefaultRes = () => {
    return {
        responseCode: null,
        response: null,
        json: function (msg) {
            this.response = msg;
            return this;
        },
        send: function (msg) {
            this.response = msg;
            return this;
        },
        statusCode: function (code) {
            this.responseCode = code;
            return this;
        }
    };
};

describe("LIB errorHandler", () => {
    let req, res;
    const next = () => {};

    beforeEach(async () => {
        req = getDefaultReq();
        res = getDefaultRes();
    });

    it("should set the status code to the status of a caught error, if exists", () => {
        const error = new NotFoundError();

        errorHandler(error, req, res, next);

        assert.equal(res.responseCode, error.getStatusCode());
    });

    it("should set the status code to 500, if error thrown does not have status set", () => {
        const error = new Error("generic error");

        errorHandler(error, req, res, next);

        assert.equal(res.responseCode, 500);
    });

    it("should set the message body to the error message of the error, if exists", () => {
        const ERROR_MESSAGE = "an error message";
        const error = new NotFoundError(ERROR_MESSAGE);

        errorHandler(error, req, res, next);

        assert.equal(res.response, ERROR_MESSAGE);
    });
});