var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
        host: "smtp.exmail.qq.com", // hostname
      port: 465, // port for secure SMTP
	auth: {
    	user: "mail@bh-lay.com",
        pass: "xxxxxxxxxxx"
	}
});

function send(mailOptions){

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }
	
	    // if you don't want to use this transport object anymore, uncomment following line
	    //smtpTransport.close(); // shut down the connection pool, no more messages
	});
};

//demo
// setup e-mail data with unicode symbols
send({
    from: "<mail@bh-lay.com>", // sender address
    to: "bh_lay@126.com", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world", // plaintext body
    html: "<b>Hello world</b>" // html body
})