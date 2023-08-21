const passport=require('passport');
const JWTstrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
const User=require('../models/user');
const env=require('./environment');
let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey :env.jwt_secret
};
passport.use(new JWTstrategy(opts,async function(jwtPayLoad,done){
    try {
        let user=await User.findById(jwtPayLoad._id);
        if(user){
            done(null,user);
        }
        else{
            done(null,false);
        }
    } catch (error) {
        console.log('error finding user jwt');
        done(error,false);
    }
}));
module.exports=passport;