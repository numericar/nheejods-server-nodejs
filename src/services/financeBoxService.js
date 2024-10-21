const dbContext = require('../configs/MySQLDbContext');

class FinanceBoxService {
    async createFinanceBoxAsync(userId, year, month) {
        try {
            if (typeof userId != 'number' && typeof year != 'number' && typeof month != 'number') throw new Error('Data for create finance box is invalid');

            const currentDate = new Date();

            const query = 'INSERT INTO finance_boxs (user_id, year, month, created_at, updated_at) VALUES (?,?,?,?,?)';
            const values = [userId, year, month, currentDate, currentDate];
            const result = await dbContext.executeAsync(query, values);

            return result.insertId;
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

    async financeBoxIsExistsByFinanceBoxIdAsync(financeBoxId) {
        try {
            if (isNaN(financeBoxId.trim())) throw new Error('Finance box id is invalid type');

            const query = 'SELECT fb.id FROM finance_boxs fb WHERE fb.id = ?';
            const values = [financeBoxId];
            const financeBox = (await dbContext.executeAsync(query, values))[0];

            return (typeof financeBox != 'undefined' && financeBox != null);
        } catch (ex) {
            throw ex;
        }
    }

    async findFinanceBoxByIdAsync(financeBoxId) {
        try {
            if (isNaN(financeBoxId.trim())) throw new Error('Finance box id type is invalid');

            const query = 'SELECT * FROM finance_boxs fb WHERE fb.id = ?';
            const values = [financeBoxId];
            const financeBox = (await dbContext.executeAsync(query, values))[0];

            return financeBox;
        } catch (ex) {
            throw ex;
        }
    }

    async findFinanceBoxByUserIdAndDateAsync(userId, startDateObject, endDateObject) {
        try {
            if (typeof userId != 'number' && typeof year != 'number' && typeof month != 'number') throw new Error('Data for create finance box is invalid');

            const query = `SELECT fb.id, fb.user_id, fb.year, fb.month FROM finance_boxs fb WHERE 
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

    async fincByIdAsync(boxId) {
        try {
            if (typeof boxId != 'number' || boxId < 0) throw new Error('Box id is invalid');  

            const query = `SELECT f.id, f.year, f.month FROM nheejods_db.finance_boxs f WHERE f.id = ?`;
            const values = [boxId];
            const financeBox = await dbContext.executeAsync(query, values);

            return financeBox[0];
        } catch (ex) {
            throw ex;
        }
    }

    async isOwnerAsync(boxId, userId) {
        try {
            if (typeof boxId != 'number' || boxId < 0) throw new Error('Box id is invalid');  

            const query = `SELECT f.user_id AS boxUserId FROM nheejods_db.finance_boxs f WHERE f.id = ?`;
            const values = [boxId];
            const { boxUserId } = (await dbContext.executeAsync(query, values))[0];

            return (boxUserId == userId);
        } catch (ex) {
            throw ex;
        }
    }

    async removeBoxByIdAsync(boxId) {
        try {
            if (typeof boxId != 'number' || boxId < 0) throw new Error('Box id is invalid');  

            const query = `DELETE FROM nheejods_db.finance_boxs fb WHERE fb.id = ?`;
            const values = [boxId];
            await dbContext.executeAsync(query, values);
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = new FinanceBoxService();