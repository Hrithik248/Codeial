const Post=require('../models/posts');
const Comment=require('../models/comment');
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
module.exports.destroy=function(req,res){
    Post.findById(req.params.id).then((post)=>{
        //console.log(crpost);
        if(post.user==req.user.id){
            Post.findByIdAndDelete(post.id).then(()=>{
                Comment.deleteMany({post:post.id}).then(()=>{
                    return res.redirect('back');
                });
            });
        }
        else{
            return res.redirect('back');
        }
    })
};