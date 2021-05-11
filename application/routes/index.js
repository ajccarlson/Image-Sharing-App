var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById} = require('../middleware/postsmiddleware');
var db = require('../config/database');

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
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

router.use('/postimage', isLoggedIn)
router.get('/postimage', (req, res, next) => {
  res.render("postimage", {title: "Create a Post"});
});

router.get('/imagepost', (req, res, next) => {
  res.render("imagepost", {title: "Post"});
});

router.get('/post/:id(\\d+)', getPostById, (req, res, next) => {
  res.render('imagepost', {title: `Post ${req.params.id}`});
});

module.exports = router;
