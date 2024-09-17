const BaseResponseDto = require('../dtos/BaseResponseDto');
const bcrypt = require('bcrypt');

const userService = require('../services/userService');
const jwtService = require('../services/jwtService');

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

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (typeof email != 'string' || typeof password != 'string') return new BaseResponseDto(false, 'Data should not be null', null);

            const tempEmail = email.trim();
            const tempPassword = password.trim();
           
            if (tempEmail.length == 0 || tempPassword.length == 0) return res.status(400).json(new BaseResponseDto(false, 'Data should not be empty', null)); 

            // valodate password
            if (tempPassword.length < 8) return res.status(400).json(new BaseResponseDto(false, 'Password must more than or equals 8'));

            // validate email is exists
            const isEmailExists = await userService.emailIsExistsAsync(tempEmail);
            if (!isEmailExists) return res.status(400).json(new BaseResponseDto(false, 'Email or Password is invalid', null));

            // validate password
            const currentPasswordHashed = await userService.findPasswordHashedByEmailAsync(tempEmail);
            const isPasswordMatched = await bcrypt.compare(tempPassword, currentPasswordHashed);

            if (!isPasswordMatched) return res.status(400).json(new BaseResponseDto(false, 'Email or Password is invalid', null));

            // get user by email
            const user = await userService.findByEmailAsync(email);
            if (typeof user == 'undefined' || user == null) return res.status(400).json(new BaseResponseDto(false, 'Email or Password is invalid', null));

            console.log(user)

            // generate jwt token
            const token = jwtService.generateToken(user);

            // add token to response cookie
            res.cookie('token', token, {
                maxAge: (1000 * 60) * 60 * 24,
                secure: true,
                httpOnly: false,
                sameSite: 'Strict'
            });

            // return to client
            return res.status(200).json(new BaseResponseDto(true, 'Successful', null));
        } catch (ex) {
            console.log(ex.message);

            return res.status(500).json(new BaseResponseDto(false, 'Failed', null));
        }
    }
}

module.exports = new AuthsController();