const BaseResponseDto = require("../dtos/BaseResponseDto");
const BaseController = require("./baseController");

const dateUtilService = require('../utils/dateUtilService');

class FinanceBoxController extends BaseController {
    async getFinanceBoxs(req, res) {
        try {
            const { start, end } = req.query;
            if (typeof start != 'string' && typeof end != 'string') return res.status(400).json(new BaseResponseDto(false, 'Date is invalid', null));

            const tempStart = start.trim();
            const tempEnd = end.trim();

            // validate date should not be empty
            if (tempStart.length == 0 || tempEnd.length == 0) return res.status(400).json(new BaseResponseDto(false, 'Data should not be empty', null));

            // validate format date, should be like YYYY-MM
            const startIsValidFormat = dateUtilService.isFormatYYYYMM(tempStart);
            const endIsValidFormat = dateUtilService.isFormatYYYYMM(tempEnd);
            if (!(startIsValidFormat && endIsValidFormat)) return res.status(400).json(new BaseResponseDto(false, 'Date is invalid format, format should be YYYY-MM', null));

            // parse string date to object, in object shold be like { year, month }
            const startDateObject = dateUtilService.parseStringDateToObject(tempStart);
            const endDateObject = dateUtilService.parseStringDateToObject(tempEnd);

            // validate start date should less than end date
            if (startDateObject.year > endDateObject.year) return res.status(400).json(new BaseResponseDto(false, 'Start date sould less than end date', null));

            // get user finance box
            
            // return information to client
            return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
        } catch (ex) {
            console.log(ex.message);

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }
}

module.exports = new FinanceBoxController();