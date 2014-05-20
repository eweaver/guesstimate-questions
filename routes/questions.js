var express = require('express');
var router = express.Router();
var config = require('../etc/config');
var Parse = require('parse').Parse;

Parse.initialize(config.parse.app_id, config.parse.api_secret);

router.post('/list', function(req, res) {
    var Category = Parse.Object.extend("Category");
    var qCategory = new Category();
    qCategory.id = req.body.categoryId;

    var Question = Parse.Object.extend("Question");

    var query = new Parse.Query(Question);
    query.equalTo("categoryId", qCategory);

    query.find({
        success: function(results) {
            res.render('questionslist', { questionList: results });
        },
        error: function(error) {
            res.render('questionslist', { questionList: []});
        }
    });
});

router.post('/', function(req, res) {
    if(typeof req.body.categoryId === 'undefined' || req.body.categoryId.length < 1) {
        res.render('index', { result: "Must select a valid category." });
        return;
    }

    if(typeof req.body.text === 'undefined' || req.body.text.length < 1) {
        res.render('index', { result: "Question text cannot be blank." });
        return;
    }

    req.body.answer = Number(req.body.answer);

    if(typeof req.body.answer === 'undefined' || isNaN(req.body.answer)) {
        res.render('index', { result: "Answer must be a valid number." });
        return;
    }

    var Category = Parse.Object.extend("Category");
    var qCategory = new Category();
    qCategory.id = req.body.categoryId;

    var Question = Parse.Object.extend("Question");
    var newQuestion = new Question();
    newQuestion.set("categoryId", qCategory);
    newQuestion.set("text", req.body.text);
    newQuestion.set("answer", req.body.answer);
    newQuestion.set("flavor_text", req.body.flavor_text);

    newQuestion.save(null, {
        success: function(newQuestion) {
            var Category = Parse.Object.extend("Category");
            var query = new Parse.Query(Category);

            query.find({
                success: function(results) {
                    res.render('index', { result: "Question created!" , categoryList: results });
                },
                error: function(error) {
                    res.render('index', { result: "Question created!", categoryList:error});
                }
            });
        },
        error: function(newQuestion, error) {
            var Category = Parse.Object.extend("Category");
            var query = new Parse.Query(Category);

            query.find({
                success: function(results) {
                    res.render('index', { result: error.message  , categoryList: results });
                },
                error: function(error) {
                    res.render('index', { result: error.message , categoryList:error});
                }
            });
        }
    });
});

module.exports = router;
