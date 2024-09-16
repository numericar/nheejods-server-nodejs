class BaseResponseDto {
    constructor (isSuccess, message, data) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
        this.responseDateTime = new Date();
    }
}

module.exports = BaseResponseDto;