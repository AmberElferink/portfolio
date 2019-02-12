var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
const request = require('request');

var winston = require('../config/winston');



router.get('/', function(req, res, next) {
console.log("contact");
  res.render('contact', {title: "Let's talk!", name: "", email: "", subject: "", content: "", errs: []});
});


router.post('/', function(req, res, next) {
  //-------------------------------------------------------RECAPTCHA PART---------------------------------------------------------------------
  //tutorial on: https://codeforgeek.com/2016/03/google-recaptcha-node-js-tutorial/
  //for the testing phase, the following keys are used:
  //Site key, in contact.jade file form:
  //Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
  //secret key, here.
  //Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
  //these are the development keys and will be changed for your own generated keys on the server. Get your keys at: https://www.google.com/recaptcha/admin

  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.render('contact', {
      title: "Let's talk!", 
      name: req.body.name, 
      email: req.body.email, 
      subject: req.body.subject, 
      content: req.body.content, 
      errs: [{msg: "Please check the captcha checkbox."}]
    });  
  }
  // Put your secret key here.
  var secretKey = process.env.CAPTCHA_KEY_PORTFOLIO;
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.render('contact', {
        title: "Let's talk!", 
        name: req.body.name, 
        email: req.body.email, 
        subject: req.body.subject, 
        content: req.body.content, 
        errs: [{msg: "Failed captcha verification, try again."}]
      });   }
  });


  //--------------------------------------FORM VALIDATION PART----------------------------------------------------
  req.checkBody('name', 'name is required').notEmpty().isLength({min: 3}).escape();
  req.checkBody('email', 'email must be a valid email format').notEmpty().isEmail().normalizeEmail();
  req.checkBody('subject', 'subject is required').notEmpty().escape();
  req.checkBody('content', 'content is required').notEmpty().trim().escape();

  var errors = req.validationErrors();
  console.log(errors);
  if(errors) {
    console.log(errors);
    return res.render('contact', {
      title: "Let's talk!", 
      name: req.body.name, 
      email: req.body.email, 
      subject: req.body.subject, 
      content: req.body.content, 
      errs: errors
    });
  }

  ///----------------------------------MESSAGE SENDING PART---------------------------------------------------------
  const msg = {
    to: 'amber.elferink@gmail.com',
    from: {
      email: req.body.email,
      name: req.body.name
    },
    subject: req.body.subject,
    text: req.body.content + ' \r\n sent from portfolio site www.amber-elferink.com.',
  };
  var host = req.get('host');
  winston.info(`host: ${host} sent a message from - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  winston.info(msg);

  //if(host != 'localhost:3000')
  //{
   // res.send("Please use the original website to send me an email.")
   // winston.warn(`above message was not sent from the original website and has not been sent to mail`)
   // return;
  //}
  const sgMail = require('@sendgrid/mail');

  //this reads the secret key from the process environment
  //the key was loaded in there by a .env file in the root folder of the project
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);


  
  sgMail.send(msg, function(err, json) {
    if (err) {
      return res.render('contactResponse', 
        {title: 'An error with sending the email has occured. Please try again later or contact me via LinkedIn'});
    }
    
    res.render('contactResponse', 
    {title: 'Thank you for your email. I will respond as soon as possible.'});

  }); 

});

module.exports = router;
