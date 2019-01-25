const errorHandler = (err, req, res, next) => {
    res.statusCode(err.status || 500).send(err.message);
};

module.exports = errorHandler;