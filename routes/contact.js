var express = require('express');
var router = express.Router();
var {body, validationResult} = require('express-validator');
const request = require('request');

var winston = require('../config/winston');



router.get('/', function(req, res, next) {
//console.log("contact");
  res.render('contact', {title: "Let's talk!", name: "", email: "", subject: "", content: "", errs: []});
});

validationRules = [
  body('name', 'name is required').isLength({min: 2}).exists().escape(),
  body('email', 'email must be a valid email format').exists().isEmail().normalizeEmail(),
  body('subject', 'subject is required').exists().escape(),
  body('content', 'content is required').exists().trim().escape()
];



router.post('/', validationRules, (req, res, next) => {

  checkRECAPTCHA(function(err, message){
    if(message === "allgood")
    {
      validateForm(function(validateErrs){
        if(validateErrs)
        {
          //console.error(validateErrs);
          return res.render('contact', {
            title: "Let's talk!", 
            name: req.body.name, 
            email: req.body.email, 
            subject: req.body.subject, 
            content: req.body.content, 
            errs: validateErrs
          });
        }
        else 
        {
          sendEmail(req, res);
        }
      }, req);
    }
    else
    {
      return res.render('contact', {
        title: "Let's talk!", 
        name: req.body.name, 
        email: req.body.email, 
        subject: req.body.subject, 
        content: req.body.content, 
        errs: [{msg: message}]
      });
    }
  }, req);
});
  //-------------------------------------------------------RECAPTCHA PART---------------------------------------------------------------------
  //tutorial on: https://codeforgeek.com/2016/03/google-recaptcha-node-js-tutorial/
  //for the testing phase, the following keys are used:
  //Site key, in contact.pug file form:
  //Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
  //secret key, here.
  //Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
  //these are the development keys and will be changed for your own generated keys on the server. Get your keys at: https://www.google.com/recaptcha/admin

  function checkRECAPTCHA(callback, req) {
    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      callback(undefined, "Please check the captcha checkbox");
    }
    else {
      // Put your secret key here.
      var secretKey = process.env.CAPTCHA_KEY_PORTFOLIO;
      // req.connection.remoteAddress will provide IP address of connected user.
      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
      // Hitting GET request to the URL, Google will respond with success or error scenario.
      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          winston.warning(body["error-codes"]);
          callback(undefined, "reCAPTCHA verification went wrong, please try again.");
        }
        else {
          callback(undefined, "allgood");
        }
      });
    }
  }


  //--------------------------------------FORM VALIDATION PART----------------------------------------------------
  function validateForm(callback, req) {

    var errors = validationResult(req).errors;

    if(errors) {
     //console.log(errors);
      callback(errors);
    }
    else {
      //console.log('No errors');
      callback(undefined);
    }
  }
  

  ///----------------------------------MESSAGE SENDING PART---------------------------------------------------------
 
function sendEmail(req, res) {
  const msg = {
    to: 'portfolio.amber.elferink@gmail.com',
    from: {
      email: req.body.email,
      name: req.body.name
    },
    subject: req.body.subject,
    text: req.body.content + ' \r\n sent from portfolio site www.amberelferink.com.',
  };
  var host = req.get('host');
  winston.info(`host: ${host} sent a message from - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  winston.info(msg);

  const sgMail = require('@sendgrid/mail');

  //this reads the secret key from the process environment
  //the key was loaded in there by a .env file in the root folder of the project
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail.send(msg, function(err, json) {
    if (err) {
      return res.render('contactResponse', 
        {title: 'An error with sending the email has occured. Please try again later or contact me via LinkedIn'});
    }
    else {
      res.render('contactResponse', 
      {title: 'Thank you for your email. I will respond as soon as possible.'});
    }
  }); 
}

module.exports = router;
