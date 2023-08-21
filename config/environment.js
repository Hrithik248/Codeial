const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');
const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)|| fs.mkdirSync(logDirectory);
const accessLogStream= rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const production={
    name:'production',
    asset_path:process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service:'gmail',
        port:587,
        host:'smtp.gmail.com',
        secure:false,
        auth:{
            user:process.env.CODEIAL_GMAIL_HOST_MAIL,
            pass:process.env.CODEIAL_GMAIL_HOST_PASSWORD
        }
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL:process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}
//console.log(process.env.CODEIAL_ASSET_PATH,production.asset_path,typeof production.asset_path);
module.exports=eval(process.env.CODEIAL_ENVIRONMENT==undefined?development:process.env.CODEIAL_ENVIRONMENT);
//module.exports=eval(process.env.NODE_ENV==undefined?development:process.env.CODEIAL_ENVIRONMENT);