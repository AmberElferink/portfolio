var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi, nice to meet you', stitle: "Hi, I'm Amber"} );
});

router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'All Projects', stitle: ''});
});

router.get('/workexperience', function(req, res, next) {
  res.render('workexperience', { title: 'My Workexperience', stitle: ''});
});




module.exports = router;

