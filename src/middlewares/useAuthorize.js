const BaseResponseDto = require("../dtos/BaseResponseDto");

function useAuthorize(req, res, next) {
    if (typeof req.user != 'undefined') {
        return next();
    } else {
        return res.status(401).json(new BaseResponseDto(false, 'Unauthorize', null));
    }
}

module.exports = useAuthorize;