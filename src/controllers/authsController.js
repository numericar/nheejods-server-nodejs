const BaseResponseDto = require('../dtos/BaseResponseDto');
const userService = require('../services/userService');
const bcrypt = require('bcrypt');

const BaseController = require("./baseController");

class AuthsController extends BaseController {
    async register(req, res) {
        try {
            const { email, password } = req.body;

            // validate raw data from client
            if ((typeof email != 'string') || (typeof password != 'string')) return res.status(400).json(new BaseResponseDto(false, 'Data should not be null', null));

            const tempEmail = email.trim();
            const tempPassword = password.trim();

            if (tempEmail.length == 0 || tempPassword.length == 0) return res.status(400).json(new BaseResponseDto(false, 'Data should not be empty', null)); 

            // valodate password
            if (tempPassword.length < 8) return res.status(400).json(new BaseResponseDto(false, 'Password must more than or equals 8'));

            // validate is exists
            const isEmailExists = await userService.emailIsExistsAsync(tempEmail);
            if (isEmailExists) return res.status(400).json(new BaseResponseDto(false, 'Email is already exists', null));

            // hash password
            const passwordHashed = (await bcrypt.hash(tempPassword, 10)).toString();

            // save user
            await userService.createAsync(email, passwordHashed);

            return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
        } catch (ex) {
            console.log(ex.message);

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }
}

module.exports = new AuthsController();