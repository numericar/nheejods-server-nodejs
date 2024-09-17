const BaseResponseDto = require("../dtos/BaseResponseDto");

function useAuthentication (req, res, next) {
    try {
        const token = req.cookies.token;

        console.log(token);
    } catch (ex) {
        console.log(ex.message);

        return res.status(400).json(new BaseResponseDto(false, 'Failed', null));
    } finally {
        next();
    }
}

module.exports = useAuthentication;