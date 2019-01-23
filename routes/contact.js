var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
console.log("contact");
  res.render('contact', {title: "Let's talk!"});
});


router.post('/', function(req, res, next) {
  var host = req.get('host');
  console.log('host ' + host + " sent an email from email address: " + req.body.email);
  console.log('content: ' + req.body.content);
  if(host != 'localhost:3000')
  {
    res.send("Please use the original website to send me an email.")
    return;
  }
  const sgMail = require('@sendgrid/mail');

  //this reads the secret key from the process environment
  //the key was loaded in there by a .env file in the root folder of the project
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'myemail@gmail.com',
    from: req.body.email,
    subject: req.body.subject,
    text: req.body.content,
  };
  console.log(msg);
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
