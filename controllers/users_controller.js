const User=require('../models/user');
module.exports.profile=function(req,res){
    return res.render('user_profile',{
        title:'User profile'
    });
};
//render user sign in page
module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
        title:'User | Sign in'
    });
};
//render user sign up page
module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title:'User | Sign up'
    })
};
//create user through sign up
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User
        .findOne({email:req.body.email})
        .then((user,err)=>{
            if(err){
                console.log('error in finding user for sign up',err);
                return;
            }
            if(!user){
                //console.log(user,err);
                User
                    .create(req.body)
                    .then((user,err)=>{
                        //console.log(user,err);
                        if(err){
                            console.log('error in creating user',err);
                            return;
                        }
                        return res.redirect('/users/sign-in');
                    })
            }
            else{
                return res.redirect('back');
            }
        })

};
//create session or sign in user
module.exports.createSession=function(req,res){
    //find the user
    User.findOne({email:req.body.email})
        .then((user)=>{
            //handle user found
            if(user){
                //handle password matching
                if(user.password!=req.body.password){
                    return res.redirect('back');
                }
                //handle create session
                res.cookie('user_id',user.id);
                return res.redirect('/users/profile');
            }
            else{
                //handle user not found
                return res.redirect('back');
            }
        })
        .catch((err)=>{
            console.log('Error in finding user',err);
            return;
        })
};