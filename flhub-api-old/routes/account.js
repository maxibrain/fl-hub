var express = require('express');
var router = express.Router();

router.all('*', function(req, res, next) {
    req.users = req.db.get('users');
    next();
});

router.get('/', function (req, res, next) {
    req.users.findOne({ _id: req.user._id }, function(error, user) {
        if (error) return next(error);
        res.render('account', { title: "Account", account: user, user: user, returnUrl: req.baseUrl });
    });
});

router.post('/', function (req, res, next) {
    req.users.updateById(req.user._id, req.body, function (error) {
        if (error) {
            return next(error);
        }
        res.redirect('/account');
    });
});

module.exports = router;