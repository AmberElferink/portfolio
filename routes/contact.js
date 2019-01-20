var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
console.log("contact");
  res.render('contact', {title: "Let's talk!"});
});


router.post('/', function(req, res, next) {
  const sgMail = require('@sendgrid/mail');
  console.log(req.url);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'toemail@gmail.com',
    from: 'fromemail@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
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
