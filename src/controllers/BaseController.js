const BaseResponseDto = require('../dtos/BaseResponseDto');

class BaseController {
    healthCheck(req, res) {
        return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
    }
}

module.exports = BaseController; 