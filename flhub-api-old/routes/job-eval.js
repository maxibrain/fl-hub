var express = require('express');
var router = express.Router();
var Provider = require('../models/provider');
var Feed = require('../models/feed');
var UserFeed = require('../models/user-feed');

/* GET home page. */
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    var provider = new Provider(req.user);
    provider.providers.upwork.getJob(id, (error, data) => {
        if (error) return next(error);
        res.json(data);
        //res.render('jobs', { title: 'Jobs', jobs: data, user: req.user, query: req.query });
    });
});

module.exports = router;
