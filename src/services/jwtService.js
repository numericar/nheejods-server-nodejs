const jwt = require('jsonwebtoken');
require('dotenv').config();

class JwtService {
    generateToken(user) {
        try {
            if (typeof user == 'undefined' || user == null || typeof user.id == 'undefined') throw new Error('User information is invalid');

            const secretKey = process.env.JWT_KEY;
            if (typeof secretKey == 'undefined') throw new Error('JWT Secret key not initialize');

            const token = jwt.sign({ id: user.id }, secretKey, { algorithm: 'HS256', expiresIn: '1d' });

            return token;
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = new JwtService();