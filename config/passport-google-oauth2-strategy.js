const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const env=require('./environment');
passport.use(new googleStrategy({
    clientID:env.google_client_id,
    clientSecret:env.google_client_secret,
    callbackURL:env.google_callbackURL
},
async function(accessToken,refreshToken,profile,done){
    try {
        let user=await User.findOne({email:profile.emails[0].value});
        //console.log(profile);
        //console.log(accessToken,refreshToken);
        //if user is found then set it as req.user
        if(user){
            done(null,user);
        }
        else{
            //if not found create user and set it as req.user
            //redeclaration of user
            let user=await User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            });
            return done(null,user);
        }
    } catch (error) {
        console.log('Error in google oauth strategy',error);
        return;
    }
}
));
module.exports=passport;