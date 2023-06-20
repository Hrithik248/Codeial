const Post=require('../models/posts');
module.exports.create=function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user._id
    })
    .then((post)=>{
        return res.redirect('back');
    })
    .catch((err)=>{
        console.log(err);
        return;
    });
};