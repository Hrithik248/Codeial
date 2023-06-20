const Post=require('../models/posts');
module.exports.home=function(req,res){
    //console.log(req.cookies);
    Post.find({}).populate('user').then((Posts)=>{
        console.log(Posts);
        return res.render('home',{
            title:'Home | Codeial',
            Posts
        });
    });
};