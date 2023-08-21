//if the user changes the userid in cookies by seeing id in html and after decrypting it ,
// it belongs to the some other user then he may be able to exploit the website
const express= require('express');
const env=require('./config/environment');
const logger=require('morgan');
const port=8000;
const app= express();
require('./config/view-helpers')(app);
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLoacal=require('./config/passport-local-strategy');
const MongoStore=require('connect-mongo');
//flash messages 
const flash =require('connect-flash');
const customMware=require('./config/flash-message-middleware');
//setup the chatserver to be used with socket.io
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen('5000',()=>{
  console.log('chat server is listening on 5000');
});
/*compiling all scss files*/ 
const sass= require('node-sass');
const fs = require('fs');
const path = require('path');
const scssFolder =path.join(__dirname,env.asset_path,'scss');
const cssFolder =path.join(__dirname,env.asset_path,'css');
//if env.name=='development' then compile css
fs.readdir(scssFolder, (err, files) => {
  if (err) {
    console.error('Error reading scss folder:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.scss') {
      const scssFile = path.join(scssFolder, file);
      const cssFile = path.join(cssFolder, path.basename(file, '.scss') + '.css');

      sass.render({
        file: scssFile,
        outputStyle: 'extended',
        outFile: cssFile,
        sourceMap: true,
        sourceMapEmbed: true,
      }, (error, result) => {
        if (error) {
          console.error(`Error compiling ${scssFile}:`, error);
        } else {
          fs.writeFile(cssFile, result.css, err => {
            if (err) {
              console.error(`Error writing ${cssFile}:`, err);
            } else {
              console.log(`Compiled ${scssFile} to ${cssFile}`);
            }
          });
        }
      });
    }
  });
});
/*compiling scss files over */
/*sass.render({
    file:'./assets/scss/home.scss',
    outFile:'./assets/css/home.css',
    sourceMap: true,
    sourceMapEmbed: true,
    debug:true,
    outputStyle:'extended',
    //prefix:'/css'
},function(err,result){
    if(err){
        console.log('err',err);
    }
    else{
        console.log('result',result);
    }
});*/
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(env.asset_path));
//making uploads folder available 
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options));
app.use(expressLayouts);
//extract style and script from sub pages to layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
// set up view engine
app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store session cookie in the db
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/codeial_development',
        autoRmove:'disabled'
    },function(err){
        console.log(err||'connect mongostore ok');
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err){
        console.log(`Error in starting Server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});