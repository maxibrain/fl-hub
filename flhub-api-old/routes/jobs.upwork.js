var express = require('express');
var router = express.Router();
var UpworkProvider = require('../models/provider.upwork');

router.get('/', function (req, res, next) {
    var query = req.query.query || "*";
    var count = req.query.count || 20;
    var settings = {
        query: query,
        count: count,
    };
    var provider = new UpworkProvider(req.user.upwork);
    provider.getJobsRaw(settings, function (error, data) {
        if (error) return next(error);
        res.json(data);
    });
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    var provider = new UpworkProvider(req.user.upwork);
    provider.getJobRaw(id, function (error, data) {
        if (error) return next(error);
        res.json(data);
    });
});

module.exports = router;
