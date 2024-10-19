const BaseResponseDto = require("../dtos/BaseResponseDto");
const BaseController = require("./baseController");

const financeBoxService = require('../services/financeBoxService');
const financeItemService = require('../services/financeItemService');
const dateUtilService = require('../utils/dateUtilService');
const ResponseFinanceBoxsDto = require("../dtos/responses/ResponseFinanceBoxsDto");
const ResponseFinanceBoxDto = require('../dtos/responses/ResponseFinanceBoxDto');

class FinanceBoxController extends BaseController {
    async createFinanceBox(req, res) {
        try {
            const { year, month } = req.body;
        const { userId } =  req.user;

        if (typeof year != 'number' || typeof month != 'number') return res.status(400).json(new BaseResponseDto(false, 'Data is invalid', null));

        // validate year should more than 1970
        if (year < 1970) return res.status(400).json(new BaseResponseDto(false, 'Year should be more than 1970', null));

        // validate month should between 1 - 12
        if (month < 1 || month > 12) return res.status(400).json(new BaseResponseDto(false, 'Month should be between 1 - 12', null));

        // validate finance box is exists
        const isExists = await financeBoxService.financeBoxIsExists(userId, year, month);
        if (isExists) return res.status(500).json(new BaseResponseDto(false, 'Finance box aleady exists', null));

        // create finance box
        await financeBoxService.createFinanceBoxAsync(userId, year, month);

        return res.status(201).json(new BaseResponseDto(true, 'Successful', null));
        } catch (ex) {
            console.log(ex.message);

            return res.status(400).json(new BaseResponseDto(false, 'Failed', null));
        }
    }

    async updateFinanceItems(req, res) {
        try {
            const { appends, updates, removes } = req.body;
            const { financeBoxId } = req.params;
            const { userId } = req.user;

            if (!Array.isArray(appends) || !Array.isArray(removes) || isNaN(financeBoxId.trim())) return res.status(400).json(new BaseResponseDto(false, 'Data is invalid', null));

            // validate finance box is exists
            const financeBoxIsExists = await financeBoxService.financeBoxIsExistsByFinanceBoxIdAsync(financeBoxId);
            if (!financeBoxIsExists) return res.status(400).json(new BaseResponseDto(false, 'Finance box id is invalid', null)); 

            // validate request user is owner of finance box
            const financeBox = await financeBoxService.findFinanceBoxByIdAsync(financeBoxId);
            if (typeof financeBox == 'undefined') return res.staus(400).json(new BaseResponseDto(false, 'Finance box not found', null));

            // validate object appends
            for (let i = 0; i < appends.length; i++) {
                if (typeof appends[i].title == 'undefined' || typeof appends[i].amount == 'undefined' || typeof appends[i].type == 'undefined') {
                    return res.status(400).json(new BaseResponseDto(false, 'Object is invalid', false));
                }
            }

            // validate object updates
            for (let i = 0; i < updates.length; i++) {
                if (typeof updates[i].id == 'undefined' || typeof updates[i].title == 'undefined' || typeof updates[i].amount == 'undefined') {
                    return res.status(400).json(new BaseResponseDto(false, 'Object is invalid', false));
                }
            }

            // removes object remove
            for (let i = 0; i < removes.length; i++) {
                if (typeof removes[i].id == 'undefined') {
                    return res.status(400).json(new BaseResponseDto(false, 'Object is invalid', false));
                }
            }

            // appends
            for (let i = 0; i < appends.length; i++) {
                await financeItemService.createFinanceItemAsync(financeBoxId, appends[i].title, appends[i].amount, appends[i].type);
            }

            // updates
            for (let i = 0; i < updates.length; i++) {
                // validate req user is owner of finance box
                if (!await financeItemService.userIsOwnerFinanceItemAsync(updates[i].id, userId)) return res.status(400).json(new BaseResponseDto(false, `finance box id: ${updates[i].id} can't updated, unautorize`));

                // update item
                await financeItemService.updateFinanceItemByIdAsync(updates[i].id, updates[i].title, updates[i].amount);
            }

            // removes
            for (let i = 0; i < removes.length; i++) {
                // validate req user is owner of finance box
                if (!await financeItemService.userIsOwnerFinanceItemAsync(removes[i].id, userId)) return res.status(400).json(new BaseResponseDto(false, `finance box id: ${removes[i].id} can't updated, unautorize`));

                // remove item
                await financeItemService.removeFinanceItemByIdAsync(removes[i].id);
            }

            return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
        } catch (ex) {
            console.log(ex.message);

            return res.status(400).json(new BaseResponseDto(false, 'Failed', null));
        }
    }
    
    async getFinanceBoxs(req, res) {
        try {
            const { start, end } = req.query;
            const { userId } = req.user;

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
            const rawFinanceBoxs = await financeBoxService.findFinanceBoxByUserIdAndDateAsync(userId, startDateObject, endDateObject);

            const financeBoxs = [];

            // get finance summary
            for (let i = 0; i < rawFinanceBoxs.length; i++) {
                const financeBox = rawFinanceBoxs[i];

                // get finance items by finance box id
                const financeItems = await financeItemService.findByBoxIdAsync(financeBox.id);

                let income = 0;
                let expense = 0;

                for (let itemIndex = 0; itemIndex < financeItems.length; itemIndex++) {
                    const financeItem = financeItems[itemIndex];
                    const currentItemAmount = Number(financeItem.amount);

                    switch (financeItem.type) {
                        case 1: 
                            income += currentItemAmount;
                            break;
                        case 2:
                            expense += currentItemAmount;
                            break;
                        default:
                            throw new Error('Found type of finance item not support');
                    }
                }
                
                const tempMonth = (financeBox.month.toString().length <= 1) ? `0${financeBox.month}` : financeBox.month;
                const title = `${financeBox.year}-${tempMonth}`;
                const remaining = income - expense;
                const expensePercent = (income > 0) ?  (expense / income) * 100 : expense;

                financeBoxs.push(new ResponseFinanceBoxsDto(financeBox.id, title, income, expense, remaining, Number(expensePercent.toFixed(2))));
            }
            
            // return information to client
            return res.status(200).json(new BaseResponseDto(true, 'Successful', financeBoxs));
        } catch (ex) {
            console.log(ex.message);

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }

    async getFinanceBoxById(req, res) {
        try {
            const { userId } = req.user;
            const { financeBoxId } = req.params;

            if (typeof financeBoxId != 'string' && typeof financeBoxId != 'number') return res.status(400).json(new BaseResponseDto(false, 'Finance box id is invalid', null));

            const boxId = (typeof financeBoxId == 'string') ? Number(financeBoxId) : financeBoxId;

            const isOwner = await financeBoxService.isOwnerAsync(boxId, userId);
            if (!isOwner) return res.status(400).json(new BaseResponseDto(false, 'User unauthorize to get finance box', null)); 

            const financeBox = await financeBoxService.fincByIdAsync(boxId);

            if (financeBox == null || financeBox == undefined) return res.status(400).json(new BaseResponseDto(false, 'Finance Box not found', null));

            const financeItems = await financeItemService.findByBoxIdAsync(boxId);

            let income = 0;
            let expense = 0;
            const incomeItems = [];
            const expenseItems = [];

            for (let itemIndex = 0; itemIndex < financeItems.length; itemIndex++) {
                const financeItem = financeItems[itemIndex];
                const currentItemAmount = Number(financeItem.amount);

                switch (financeItem.type) {
                    case 1:
                        income += currentItemAmount;
                        incomeItems.push({...financeItem, amount: currentItemAmount});
                        break;
                    case 2:
                        expense += currentItemAmount;
                        expenseItems.push({...financeItem, amount: currentItemAmount});
                        break;
                    default:
                        throw new Error('Found type of finance item not support');
                }
            }

            const tempMonth = (financeBox.month.toString().length <= 1) ? `0${financeBox.month}` : financeBox.month;
            const title = `${financeBox.year}-${tempMonth}`;
            const remaining = income - expense;

            return res.status(200).json(new BaseResponseDto(true, 'Successful', new ResponseFinanceBoxDto(title, income, expense, remaining, incomeItems, expenseItems)));
        } catch (err) {
            console.log(err.message)

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }

    async removeBoxById(req, res) {
        try {
            const { userId } = req.user;
            const { financeBoxId } = req.params;

            const isOwner = await financeBoxService.isOwnerAsync(financeBoxId, userId);
            if (!isOwner) return res.status(400).json(new BaseResponseDto(false, 'User unauthorize to remove finance box', null));

            await financeBoxService.removeBoxByIdAsync(boxId);
            await financeItemService.removeByBoxIdAsync(boxId);

            return res.status(204).json(new BaseResponseDto(true, 'Successful', null));
        } catch (err) { 
            console.log(err.message);

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }
}

module.exports = new FinanceBoxController();