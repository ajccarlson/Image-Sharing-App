var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {name: "Aaron", title: "Aaron's App"});
});

router.get('/home', (req, res, next) => {
  res.render("home", {title: "Home"});
});

router.get('/login', (req, res, next) => {
  res.render("login", {title: "Log In"});
});

router.get('/registration', (req, res, next) => {
  res.render("registration", {title: "Register"});
});

router.get('/postimage', (req, res, next) => {
  res.render("postimage", {title: "Create a Post"});
});

router.get('/imagepost', (req, res, next) => {
  res.render("imagepost", {title: "Post"});
});

module.exports = router;
