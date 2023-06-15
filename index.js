const express= require('express');
const port=8000;
const app= express();
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLoacal=require('./config/passport-local-strategy');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./assets'));
app.use(expressLayouts);
//extract style and script from sub pages to layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
// set up view engine
app.set('view engine','ejs');
app.set('views','./views');
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment
    secret:'mynigro',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    }
}));
app.use(passport.initialize());
app.use(passport.session());
//use express router
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err){
        console.log(`Error in starting Server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});