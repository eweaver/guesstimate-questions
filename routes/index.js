var express = require('express');
var router = express.Router();
var config = require('../etc/config');
var Parse = require('parse').Parse;

Parse.initialize(config.parse.app_id, config.parse.api_secret);

/* GET home page. */
router.get('/', function(req, res) {
    var Category = Parse.Object.extend("Category");
    var query = new Parse.Query(Category);

    query.find({
        success: function(results) {
            res.render('index', { categoryList: results });
        },
        error: function(error) {
            res.render('index', { categoryList:error});
        }
    });
});

module.exports = router;
