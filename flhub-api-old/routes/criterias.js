var express = require('express');
var router = express.Router();
var Criteria = require('../models/criteria.js');

/* GET criterias listing. */
router.get('/', function (req, res, next) {
    req.db.get('criterias').find({ userId: req.user._id }, function (error, criterias) {
        if (error) {
            return next(error);
        }
        res.render('criterias', { title: "Criterias", user: req.user, criterias: criterias });
    });
});

/* POST new criteria. */
router.post('/', function (req, res, next) {
    var criteria = new Criteria(req.user._id, req.body.name, req.body.expression, req.body.multiplier, req.body.icon, req.body.showName);
    req.db.get('criterias').insert(criteria, function (error) {
        if (error) {
            return next(error);
        }
        res.redirect('/criterias');
    });
});

/* POST existing criteria. */
router.post('/:id', function (req, res, next) {
    var criteria = new Criteria(req.user._id, req.body.name, req.body.expression, req.body.multiplier, req.body.icon, req.body.showName);
    req.db.get('criterias').updateById(req.params.id, criteria, function (error) {
        if (error) {
            return next(error);
        }
        res.redirect('/criterias');
    });
});

module.exports = router;
