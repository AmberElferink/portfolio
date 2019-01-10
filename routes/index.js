var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Portfolio', stitle: "Hi, I'm Amber"} );
});

router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'All Projects', stitle: ''});
});

//contact werkt niet, maar / en /projects wel?
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', stitle: 'Feel free to send me an email'});
});


module.exports = router;

