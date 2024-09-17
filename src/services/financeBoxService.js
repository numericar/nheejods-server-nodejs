const dbContext = require('../configs/MySQLDbContext');

class FinanceBoxService {
    async createFinanceBoxAsync(userId, year, month) {
        try {
            if (typeof userId != 'number' && typeof year != 'number' && typeof month != 'number') throw new Error('Data for create finance box is invalid');

            const currentDate = new Date();

            const query = 'INSERT INTO finance_boxs (user_id, year, month, created_at, updated_at) VALUES (?,?,?,?,?)';
            const values = [userId, year, month, currentDate, currentDate];
            await dbContext.executeAsync(query, values);
        } catch (ex) {
            throw ex;
        }
    }

    async financeBoxIsExists(userId, year, month) {
        try {
            if (typeof userId != 'number' && typeof year != 'number' && typeof month != 'number') throw new Error('Data for create finance box is invalid');

            const query = 'SELECT fb.id FROM finance_boxs fb WHERE fb.user_id = ? AND fb.year = ? AND fb.month = ?';
            const values = [userId, year, month];
            const financeBox = (await dbContext.executeAsync(query, values))[0];

            return (typeof financeBox != 'undefined' && financeBox != null);
        } catch (ex) {
            throw ex;
        }
    }

    async findFinanceBoxByUserIdAndDateAsync(userId, startDateObject, endDateObject) {
        try {
            if (typeof userId != 'number' && typeof year != 'number' && typeof month != 'number') throw new Error('Data for create finance box is invalid');

            const query = `SELECT fb.user_id, fb.year, fb.month FROM finance_boxs fb WHERE 
                           fb.user_id = ? AND 
                           fb.year >= ? AND 
                           fb.month >= ? AND
                           fb.year <= ? AND 
                           fb.month <= ?`;
            const values = [userId, startDateObject.year, startDateObject.month, endDateObject.year, endDateObject.month];
            const financeBoxs = await dbContext.executeAsync(query, values);

            return financeBoxs;
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = new FinanceBoxService();