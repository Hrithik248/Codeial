const User=require('../models/user');
module.exports.profile= async function(req,res){
    try{
        let user=await User.findById(req.params.id);
        return res.render('user_profile',{
            title:'User profile',
            profile_user:user
        });
    }
    catch(err){
        console.log('Error in profile controller',err);
        return;
    }
};
module.exports.update=async function(req,res){
    if(req.user.id==req.params.id){
        try {
           let updatedUser=await User.findByIdAndUpdate(req.params.id,req.body);
           return res.redirect('back');
        } catch (error) {
            console.log('Error in update controller',error);
            return;
        }
    }
    else{
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
        return res.redirect('back');
    }
    try {
        let user=await User.findOne({email:req.body.email});
        if(!user){
            let newUser= await User.create(req.body);
            return res.redirect('/users/sign-in');
        }
        else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error in create user controller',error);
        return;
    }

};
//create session or sign in user
module.exports.createSession=function(req,res){
    return res.redirect('/');
};
//sign out
module.exports.destroySession=function(req,res){
    req.logout(function(err,som){
        if(err){
            console.log('erro in signing out',err);
            return res.redirect('back');
        }
        return res.redirect('/');
    });
};