const BaseResponseDto = require("../dtos/BaseResponseDto");
const BaseController = require("./baseController");

class FinanceBoxController extends BaseController {
    async getFinanceBoxs(req, res) {
        try {
            const { start, end } = req.query;
            if (typeof start != 'string' && typeof end != 'string') return res.status(400).json(new BaseResponseDto(false, 'Date is invalid', null));

            const tempStart = start.trim();
            const tempEnd = end.trim();

            // validate format date, should be like YYYY-MM
            

            console.log(start);
            console.log(end);
            console.log(req.user);
            
            return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
        } catch (ex) {
            console.log(ex.message);

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }
}

module.exports = new FinanceBoxController();