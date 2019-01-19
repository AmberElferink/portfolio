var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi, nice to meet you :)', stitle: "Hi, I'm Amber"} );
});

router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'All Projects', stitle: ''});
});


router.get('/contact', function(req, res, next) {
  const sgMail = require('@sendgrid/mail');

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'tomail@gmail.com',
    from: 'frommail@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg, function(err, json) {
    if (err) {return res.send('AAAAAH!'); }
    res.send('WOOHOO!!')
  }); 
});



module.exports = router;

