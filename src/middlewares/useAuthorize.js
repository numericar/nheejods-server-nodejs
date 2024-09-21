const BaseResponseDto = require("../dtos/BaseResponseDto");

function useAuthorize(req, res, next) {
    console.log(req.user);
    if (typeof req.user != 'undefined' && typeof req.user.userId != 'undefined') {
        return next();
    } else {
        return res.status(401).json(new BaseResponseDto(false, 'Unauthorize', null));
    }
}

module.exports = useAuthorize;