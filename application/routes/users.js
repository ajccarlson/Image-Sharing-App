var express = require('express');
var router = express.Router();
var db = require('../config/database');
const UserModel = require('../models/Users');
const UserError = require("../helpers/error/UserError");
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  let usernameReturnValue = '';
  let emailReturnValue = '';
  let passwordReturnValue = '';
  let validationError = '';



  function validateUsername() {
    let errorMessage = [];
    const startsWithChar = /^[a-z]/i;
    const isAlphanumeric = /^[a-z0-9]+$/i;

    if (!startsWithChar.test(username)) {
        errorMessage.push('Username must start with an alphabetic character');
    }
    if (!isAlphanumeric.test(username)) {
        errorMessage.push('Username must be alphanumeric');
    }
    if (username.length < 3) {
        errorMessage.push('Username must be 3 or more characters long');
    }
    if (username.length < 1) {
        errorMessage = ['Please fill in username field'];
    }

    if (errorMessage.length > 1) {
        errorMessage.forEach(function (value, i) {
            if (i == 0)
                usernameReturnValue = value;
            else
                usernameReturnValue += '\n' + value;
        });
    }
    else
        usernameReturnValue = errorMessage;
  }

  function validateEmail() {
      let errorMessage = [];
      const isValidEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!isValidEmail.test(email)) {
          errorMessage.push('Invalid email');
      }
      if (email.length < 1) {
          errorMessage = ['Please fill in email field'];
      }

      if (errorMessage.length > 1) {
          errorMessage.forEach(function (value, i) {
              if (i == 0)
                  emailReturnValue = value;
              else
                  emailReturnValue += '\n' + value;
          });
      }
      else
          emailReturnValue = errorMessage;
  }

  function validatePassword() {
      let errorMessage = [];
      const hasUpper = /[A-Z]/;
      const hasNum = /[0-9]/;
      const hasSpecial = /[\/*-+!@#$^&*]/;


      if (!hasUpper.test(password)) {
          errorMessage.push('Password must have at least 1 uppercase letter');
      }
      if (!hasNum.test(password)) {
          errorMessage.push('Password must have at least 1 number');
      }
      if (!hasSpecial.test(password)) {
          errorMessage.push('Password must have at least 1 of the following special characters (/ * -+! @ # $ ^ & * )');
      }
      if (password.length < 8) {
          errorMessage.push('Password must be 8 or more characters long');
      }
      if (password.length < 1) {
          errorMessage = ['Please fill in password field'];
      }

      if (errorMessage.length > 1) {
          errorMessage.forEach(function (value, i) {
              if (i == 0)
                  passwordReturnValue = value;
              else
                  passwordReturnValue += '\n' + value;
          });
      }
      else
          passwordReturnValue = errorMessage;
  }

  validateUsername();
  validateEmail();
  validatePassword();

  if (emailReturnValue != '') {
    if (errorMessage.length > 1)
      validationError += '\n\n' + emailReturnValue;
    else
      validationError += emailReturnValue;
  }

  if (usernameReturnValue != '') {
    if (errorMessage.length > 1)
      validationError += '\n\n' + usernameReturnValue;
    else
      validationError += usernameReturnValue;
  }

  if (passwordReturnValue != '') {
    if (errorMessage.length > 1)
      validationError += '\n\n' + passwordReturnValue;
    else
      validationError += passwordReturnValue;
  }

  if (cpassword != password) {
    if (errorMessage.length > 1)
      validationError += '\n\n' + 'Passwords need to match';
    else
      validationError += 'Passwords need to match';
  }

  if (validationError != '') {
    throw new UserError(
      validationError,
      "/registration",
      400
    );
  }



  UserModel.usernameExists(username)
  .then((userDoesNameExist) => {
    if (userDoesNameExist) {
      throw new UserError(
        "Registration Failed: Username already exists",
        "/registration",
        200
      );
    }
    else {
      return UserModel.emailExists(email);
    }
  })
  .then((emailDoesExist) => {
    if (emailDoesExist) {
      throw new UserError(
        "Registration Failed: Email already exists",
        "/registration",
        200
      );
    }
    else {
      return UserModel.create(username, password, email);
    }
  })
  .then ((createdUserId) => {
    if (createdUserId < 0) {
      throw new UserError (
        "Server Error, user could not be created",
        "/registration",
        500
      );
    }
    else {
      successPrint("User.js --> User was created!");
      req.flash('success', 'User account has been made!');
      res.redirect('/login');
    }
  })
  .catch((err) => {
    errorPrint("user could not be made", err);
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    }
    else {
      next(err);
    }
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    throw new UserError("Invalid username and/or password!", "/login", 400);
  }

  UserModel.authenticate(username, password)
  .then((loggedUserId) => {
    if (loggedUserId > 0) {
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId = loggedUserId;
      res.locals.logged = true;
      req.flash('success', 'You have been successfully logged in!');
      req.session.save( err => {
        res.redirect('/');
      });
    }
    else {
      throw new UserError("Invalid username and/or password!", "/login", 200);
    }
  })
  .catch((err) => {
    errorPrint("user login failed");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      req.session.save( err => {
        res.redirect('/login');
      });
    }
    else {
      next(err)
    }
  })
})

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('session could not be destroyed.');
      next(err);
    }
    else {
      successPrint('Session was destroyed');
      res.clearCookie('csid');
      res.json({status: "OK", message: "user is logged out"});
    }
  })
});

module.exports = router;