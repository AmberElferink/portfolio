var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');

var winston = require('../config/winston');



router.get('/', function(req, res, next) {
console.log("contact");
  res.render('contact', {title: "Let's talk!", name: "", email: "", subject: "", content: "", errs: []});
});


router.post('/', function(req, res, next) {
  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('subject', 'subject is required').notEmpty();
  req.checkBody('content', 'content is required').notEmpty();

  var errors = req.validationErrors();
  if(errors) {
    console.log(errors);
    res.render('contact', {title: "Let's talk!", name: "", email: "", subject: "", content: "", errs: errors});
    return;
  }
  const msg = {
    to: 'myemail@gmail.com',
    from: req.body.email,
    subject: req.body.subject,
    text: req.body.content,
  };
  var host = req.get('host');
  winston.info(`host: ${host} sent a message from - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  winston.info(msg);

  if(host != 'localhost:3000')
  {
    res.send("Please use the original website to send me an email.")
    winston.warn(`above message was not sent from the original website and has not been sent to mail`)
    return;
  }
  const sgMail = require('@sendgrid/mail');

  //this reads the secret key from the process environment
  //the key was loaded in there by a .env file in the root folder of the project
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);


  /*
  sgMail.send(msg, function(err, json) {
    if (err) {
      return res.render('contactResponse', 
        {title: 'An error with sending the email has occured. Please try again later or contact me via LinkedIn'});
    }
    */
    res.render('contactResponse', 
    {title: 'Thank you for your email. I will respond as soon as possible.'});

  //}); 

});

module.exports = router;
