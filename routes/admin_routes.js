var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/create_trainingStaff', function(req, res) {
  res.render("layouts/master", {
    content: "../trainingStaff_view/create",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
  });
})

module.exports = router;
