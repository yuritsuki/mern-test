const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, ValidationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Minimal length of password field is 6 symbols').isLength({min:6})
    ],
    async(req, res) => {
        try {
            const errors = ValidationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect input'
                });
            }

            const {email, password} = req.body;

            const candidate = await User.findOne({email: email});

            if(candidate) {
                res.status(400).json({message: 'Email is already in use.'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword});

            await user.save();

            res.status(201).json({message:'User created.'});

        } catch (e) {
            res.status(500).json({message: "Something went wrong, please try again."});
        }
});

// /api/auth/login
router.post(
    '/login',
    [
        check('email','Please, type correct email').normalizeEmail().isEmail(),
        check('password', 'Please, type correct password').exists()
    ],
    async(req, res) => {
        try {
            const errors = ValidationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect input.'
                });
            }

            const {email, password} = req.body;

            const user = await User.findOne({email});

            if(!user) {
                return res.status(400).json({message: 'User not found.'});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(400).json({message: 'Wrong password. Try again.'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            );

            res.json({ token, userId: user.id});


        } catch (e) {
            res.status(500).json({message: "Something went wrong, please try again."});
        }
});

module.exports = router;