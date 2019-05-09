var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', user: req.user });
});

router.get('/login', function (req, res, next) {
    res.render('login', { returnUrl: req.query.returnUrl || req.url, title: 'Log In' });
});

router.get('/logout', function (req, res, next) {
    req.logout();
    req.session = {};
    res.redirect('/');
});

module.exports = router;
