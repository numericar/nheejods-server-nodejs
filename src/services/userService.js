const dbContext = require('../configs/MySQLDbContext');

class UserService {
    async createAsync(email, passwordHashed) {
        if (!email || !passwordHashed) throw new Error('Can\'t create user, data is invalid');

        const currentDateTime = new Date();

        const query = 'INSERT INTO users (email, password,created_at,updated_at) VALUES (?,?,?,?)';
        const values = [email, passwordHashed, currentDateTime, currentDateTime]
        await dbContext.executeAsync(query, values);
    } 

    async emailIsExistsAsync(email) {
        const query = 'SELECT u.email FROM users u WHERE u.email = ?';
        const [currentEmail] = await dbContext.executeAsync(query, [email]);

        return (currentEmail != undefined);
    }
}

module.exports = new UserService();