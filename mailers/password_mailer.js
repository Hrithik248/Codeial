const nodemailer=require('../config/nodemailer');

exports.sendPassToken=(token)=>{
    let htmlString=nodemailer.renderTemplate({token},'/forgot_password/reset_password_mail.ejs');
    //console.log(comment);
    nodemailer.transporter.sendMail({
        from:'Codeial',
        to:token.email,
        subject:'Reset password',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        //console.log('message sent',info);
        return;
    })
}