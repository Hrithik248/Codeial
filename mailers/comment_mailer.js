const nodemailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    let htmlString=nodemailer.renderTemplate({comment},'/comments/new_comment.ejs');
    //console.log(comment);
    nodemailer.transporter.sendMail({
        from:'Codeial',
        to:comment.post.user.email,
        subject:'New comment published',
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