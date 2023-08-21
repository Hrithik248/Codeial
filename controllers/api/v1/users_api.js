const User=require('../../../models/user');
const jwt=require('jsonwebtoken');
const env=require('../../../config/environment');
module.exports.createSession=async function(req,res){
    try {
        let user=await User.findOne({email:req.body.email});
        if(!user|| user.password!=req.body.password){
            return res.status(422).json({
                message:'Invalid username or password'
            });
        }
        return res.status(200).json({
            message:'Sign in is succesful, here is your token',
            token:jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'100000'})
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'internal sever error',
            error
        });
    }
};