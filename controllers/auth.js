const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwtUtils = require('../utils/jwt')
const createTokenUser = require('../utils/createTokenUser')

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new Error("Password is incorrect");
        }

        const tokenUser = createTokenUser(user);
        jwtUtils.attachCookiesToResponse({res, user : tokenUser})

        const token = req.signedCookies.token;

        return res.status(200).json({ user: tokenUser, token: token });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.postRegister = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }

    User.create({
        name: name,
        email: email,
        password: password,
    }).then(user => {
        const tokenUser = createTokenUser(user);

        jwtUtils.attachCookiesToResponse({res, user : tokenUser})
        const token = req.signedCookies.token;

        res.status(201).json({ user : tokenUser , token : token });
    }).catch(err => {
        return res.status(400).json({ err })
    })
};
