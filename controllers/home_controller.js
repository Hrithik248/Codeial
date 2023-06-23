const Post=require('../models/posts');
const Users=require('../models/user');
module.exports.home=function(req,res){
    //console.log(req.cookies);
    Post.find({}).populate('user').populate({
        path:'comments',
        populate:{
            path:'user'
        }
    }).then((Posts)=>{
        //console.log(Posts);
        Users.find({}).then((users)=>{
            return res.render('home',{
                title:'Home | Codeial',
                Posts,
                all_users:users
            });
        });
    });
};