require('dotenv').config();
const BaseResponseDto = require("../dtos/BaseResponseDto");
const jwt = require('jsonwebtoken');


function useAuthentication (req, res, next) {
    try {
        const token = req.cookies.token;

        if (typeof token != 'string') {
            return next();
        }

        const secretKey = process.env.JWT_KEY;
        if (typeof secretKey == 'undefined' || secretKey == null) throw new Error('JWT Secret key not initialize');

        const payload = jwt.verify(token, secretKey);

        req.user = {
            userId: payload.id
        };

        return next();
    } catch (ex) {
        let statusCode = 500;
        let message = 'Failed';

        if (ex.name == 'TokenExpiredError') {
            statusCode = 401;
            message = 'Token expired';
        }

        return res.status(statusCode).json(new BaseResponseDto(false, message, null));
    } 
}

module.exports = useAuthentication;