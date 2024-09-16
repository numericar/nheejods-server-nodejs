const BaseResponseDto = require("../dtos/BaseResponseDto");

function healthCheck(req, res) {
    return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
}

module.exports = {
    healthCheck
}