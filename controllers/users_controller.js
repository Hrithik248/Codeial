//const { use } = require('passport');
const User=require('../models/user');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const passwordMailer=require('../mailers/password_mailer');
const Token=require('../models/token');
const Friendship=require('../models/friendships');
module.exports.profile= async function(req,res){
    try{
        let user=await User.findById(req.params.id);
        /*let from_user=await Friendship.findOne({from_user:req.user.id,to_user:req.params.id});
        let to_user=await Friendship.findOne({from_user:req.params.id,to_user:req.user.id});*/
        const query = {
            $or: [
              { from_user: req.user.id, to_user: req.params.id },
              { to_user: req.params.id, from_user: req.user.id },
            ]
          };
        let existingFriendship=await Friendship.findOne(query);
        let alreadyFriend=false;
        if(existingFriendship){
            alreadyFriend=true;
        }
        return res.render('user_profile',{
            title:'User profile',
            profile_user:user,
            alreadyFriend
        });
    }
    catch(err){
        console.log(err);
        req.flash('error','Error in finding profile');
        //console.log('Error in profile controller',err);
        return;
    }
};
module.exports.update=async function(req,res){
    if(req.user.id==req.params.id){
        try {
           let updatedUser=await User.findById(req.params.id);
           User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('**multer error',err);
            }
            console.log(req.file);
            updatedUser.name=req.body.name;
            updatedUser.email=req.body.email;
            //console.log(path.join(__dirname+'..'+updatedUser.avatar));
            if(req.file){
                if(updatedUser.avatar&&fs.existsSync(path.join(__dirname,'..',updatedUser.avatar))){
                    //console.log('prev aav');
                    fs.unlinkSync(path.join(__dirname,'..',updatedUser.avatar));
                }
                updatedUser.avatar=User.avatarPath+'/'+req.file.filename;
            }
            updatedUser.save();
            req.flash('success','Updated successfully');
            return res.redirect('back');
           });
        } catch (error) {
            req.flash('error','Error in update controller',error);
            //console.log('Error in update controller',error);
            return;
        }
    }
    else{
        req.flash('error','You are not authorized to update this profile');
        return res.status(401).send('Unauthorized');
    }
}
//render user sign in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('profile');
    }
    return res.render('user_sign_in',{
        title:'User | Sign in'
    });
};
//render user sign up page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('profile');
    }
    return res.render('user_sign_up',{
        title:'User | Sign up'
    })
};
//create user through sign up
module.exports.create=async function(req,res){
    if(req.body.password!=req.body.confirm_password){
        req.flash('error','Password and Confirm password needs to be same');
        return res.redirect('back');
    }
    try {
        let user=await User.findOne({email:req.body.email});
        if(!user){
            let newUser= await User.create(req.body);
            req.flash('success','Your sign up was successfull');
            return res.redirect('/users/sign-in');
        }
        else{
            req.flash('error','Try another email');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error','Error in create user controller',error);
        //console.log('Error in create user controller',error);
        return;
    }

};
//create session or sign in user
module.exports.createSession=function(req,res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
};
//sign out
module.exports.destroySession=function(req,res){
    req.logout(function(err,som){
        if(err){
            req.flash('error','Error in signing out',err);
            //console.log('erro in signing out',err);
            return res.redirect('back');
        }
        req.flash('success','Logged out succesfully');
        return res.redirect('/');
    });
};
//forgot password
module.exports.forgot_password=function(req,res){
    //console.log('forger');
    return res.render('forgot_password',{
        title:'Forgot password'
    });
}
//sending reset token link on email
module.exports.sendToken=async function(req,res){
    try {
        let crUser=await User.findOne({email:req.body.email});
        if(!crUser){
            req.flash('error','You need to sign up');
            return res.redirect('back');
        }
        console.log(crUser,req.body);
        let token=await Token.create({
            email:req.body.email,
            accessToken:crypto.randomBytes(20).toString('hex')
        });
        //console.log('alt');
        passwordMailer.sendPassToken(token);
        return res.send('<h1>check your email inbox</h1>');
    } catch (error) {
        console.log('er fo',error);
        req.flash('error','You need to sign up');
        return res.redirect('back');
    }
}
//reset password
module.exports.resetPassword=async function(req,res){
    console.log('here amn');
    try {
        let token=await Token.findOne({accessToken:req.params.accessToken});
        console.log(req.params.acccessToken,token);
        if(!token){
            return res.send('<h1>your access token expired!</h1>');
        }
        return res.render('reset_password_page',{
            token,
            title:'Reset Password'
        });
    } catch (error) {
        req.flash('error','Internal server error',error);
        return res.redirect('back');
    }
}
//setting new password
module.exports.setNewPassword=async function(req,res){
    try {
        if(req.body.password!=req.body.confirm_password){
            req.flash('error','Wrong confirm password');
            return res.redirect('back');
        }
        let token=await Token.findOne({accessToken:req.params.accessToken});
        if(!token){
            req.flash('error','Token expired');
            return res.redirect('back');
        }
        let user=await User.findOne({email:token.email});
        user.password=req.body.password;
        user.save();
        await Token.deleteOne({accessToken:req.params.accessToken});
        req.flash('success','Updated successfully');
        return res.redirect('/users/sign-in');
    } catch (error) {
        req.flash('error','Internal server error');
        return res.redirect('back');
    }

}