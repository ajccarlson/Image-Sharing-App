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

  /*
  * do server side validation
  * not done in video must do on your own
  */

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

  /*
  * do server side validation
  * not done in video must do on your own
  */

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