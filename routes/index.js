var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi, nice to meet you :)', stitle: "Hi, I'm Amber"} );
});

router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'All Projects', stitle: ''});
});





module.exports = router;

