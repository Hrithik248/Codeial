const express= require('express');
const port=8000;
const app= express();
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./assets'));
app.use(expressLayouts);
//extract style and script from sub pages to layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
//use express router
app.use('/',require('./routes'));
// set up view engine
app.set('view engine','ejs');
app.set('views','./views');
app.listen(port,function(err){
    if(err){
        console.log(`Error in starting Server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});