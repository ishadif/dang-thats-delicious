const mongoose = require('mongoose')

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' })
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Name Cannot be Blank').notEmpty();
    req.checkBody('email', 'That email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extendsion: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be Blank').notEmpty();
    req.checkBody('password_confirmed','password confirm cannot be blank').notEmpty();
    req.checkBody('password_confirmed','Oops! Your password did not match').equals(req.body.password);

    const errors = req.validationErrors();
    if(errors) {
        req.flash('error', errors.map(error => error.msg ));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })

        return;
    }

    next();
}