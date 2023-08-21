const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');
 let transporter=nodemailer.createTransport(env.smtp);

 let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    //console.log('dsdf');
    //console.log(data);
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering mail template',err);
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
 };
 transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
 module.exports={transporter,renderTemplate};