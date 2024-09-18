const dbContext = require('../configs/MySQLDbContext');

class FinanceItemService {
    async createFinanceItemAsync(financeBoxId, title, amount, type) {
        try {
            if (typeof financeBoxId != 'number' || typeof title != 'string' || typeof amount != 'number' || typeof type != 'number') throw new Error('Data create finance item is invalid');

            if (type < 1 || type > 2) throw new Error('Type should between 1 - 2');

            const currentDateTime = new Date();

            const query = 'INSERT INTO finance_items (box_id, title, amount, type, created_at, updated_at) VALUES (?,?,?,?,?,?)';
            const values = [financeBoxId, title, amount, type, currentDateTime, currentDateTime];
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