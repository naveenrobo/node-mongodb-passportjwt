module.exports = {
    handleDevErrors: async (err, req, res, next) => {

        if (process.env.NODE_ENV === 'development') {
            return res.status(500).json({
                status: false,
                stack: err.stack
            }); 
        }
        res.status(500).json({
            status: false,
            message: 'something went wrong'
        });
    },

    handle404Error: async (req, res) => {
        res.status(404).json({
            status: false,
            code: 404,
            message: 'please check URL'
        });
    },

    handleExceptions: fn =>
        (req, res, next) => {
            fn(req, res)
                .catch((error) => {
                    next(error);
                });
        },
};