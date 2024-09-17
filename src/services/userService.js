const dbContext = require("../configs/MySQLDbContext");

class UserService {
    async createAsync(email, passwordHashed) {
        try {
            if (!email || !passwordHashed)
                throw new Error("Can't create user, data is invalid");

            const currentDateTime = new Date();

            const query = "INSERT INTO users (email, password,created_at,updated_at) VALUES (?,?,?,?)";
            const values = [email, passwordHashed, currentDateTime, currentDateTime];
            await dbContext.executeAsync(query, values);
        } catch (ex) {
            throw ex;
        }
    }

    async findByEmailAsync(email) {
        try {
            if (!email || typeof email != "string") throw new Error("Email not correct format");

            const query = "SELECT * FROM users u WHERE u.email = ?";
            const values = [email];
            const user = (await dbContext.executeAsync(query, values))[0];

            return user;
        } catch (ex) {
            throw ex;
        }
    }

    async findPasswordHashedByEmailAsync(email) {
        try {
            if (!email || typeof email != "string") throw new Error("Email not correct format");

            const query = "SELECT u.password FROM users u WHERE u.email = ?";
            const values = [email];
            const { password } = (await dbContext.executeAsync(query, values))[0];

            return password;
        } catch (ex) {
            throw ex;
        }
    }

    async emailIsExistsAsync(email) {
        const query = "SELECT u.email FROM users u WHERE u.email = ?";
        const [currentEmail] = await dbContext.executeAsync(query, [email]);

        return currentEmail != undefined;
    }
}

module.exports = new UserService();
