const dbContext = require('../configs/MySQLDbContext');

class FinanceItemService {
    async findByBoxIdAsync(boxId) {
        try {
            if (isNaN(boxId)) throw new Error('Finance box id type is invalid');

            const query = 'SELECT * FROM finance_items fi WHERE fi.box_id = ?';
            const values = [boxId];
            const financeItems = await dbContext.executeAsync(query, values);

            return financeItems;
        } catch (ex) {
            throw ex;
        }
    }

    async createFinanceItemAsync(financeBoxId, title, amount, type) {
        try {
            if (isNaN(financeBoxId.trim()) || typeof title != 'string' || typeof amount != 'number' || typeof type != 'number') throw new Error('Data create finance item is invalid');

            if (type < 1 || type > 2) throw new Error('Type should between 1 - 2');

            const currentDateTime = new Date();

            const query = 'INSERT INTO finance_items (box_id, title, amount, type, created_at, updated_at) VALUES (?,?,?,?,?,?)';
            const values = [financeBoxId, title, amount, type, currentDateTime, currentDateTime];
            await dbContext.executeAsync(query, values);
        } catch (ex) {
            throw ex;
        }
    }

    async updateFinanceItemByIdAsync(financeItemId, title, amount) {
        try {
            if (typeof financeItemId != 'number' || typeof title != 'string' || typeof amount != 'number') throw new Error('Data update finance item is invalid');

            const currentDateTime = new Date();

            const query = 'UPDATE finance_items fi SET fi.title = ?, fi.amount = ?, fi.updated_at = ? WHERE fi.id = ?';
            const values = [title, amount, currentDateTime, financeItemId];
            await dbContext.executeAsync(query, values);
        } catch (ex) {
            throw ex;
        }
    }
    
    async removeFinanceItemByIdAsync(financeItemId) {
        try {
            if (typeof financeItemId != 'number') throw new Error('Data update finance item is invalid');

            const query = 'DELETE FROM finance_items fi WHERE fi.id = ?';
            const values = [financeItemId];
            await dbContext.executeAsync(query, values);
        } catch (ex) {
            throw ex;
        }
    }

    async userIsOwnerFinanceItemAsync(financeItemId, userId) {
        try {
            if (typeof financeItemId != 'number' || typeof userId != 'number') throw new Error('Data for validate finance item owner is invalid');

            const query = `SELECT fb.user_id AS ownerUserId FROM finance_items fi INNER JOIN finance_boxs fb ON fi.box_id = fb.id WHERE fi.id = ?`;
            const values = [financeItemId];
            const { ownerUserId } = (await dbContext.executeAsync(query, values))[0];

            if (typeof ownerUserId == 'undefined') throw new Error('finance item id is invalid');

            return (ownerUserId == userId);
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = new FinanceItemService();