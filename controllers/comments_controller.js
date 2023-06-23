const Post=require('../models/posts');
const Comment=require('../models/comment');
module.exports.create=function(req,res){
    Post.findById(req.body.post_id).then((post)=>{
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post_id,
                user:req.user._id
            }).then((comment)=>{
                post.comments.push(comment);
                post.save();
                return res.redirect('back');
            });
        }
    });
};
module.exports.destroy=function(req,res){
    Comment.findById(req.params.id).then((comment)=>{
        if(comment.user==req.user.id){
            Comment.findByIdAndDelete(comment.id).then(()=>{
                Post.findByIdAndUpdate(comment.post,{$pull:{comments:req.params.id}}).then(()=>{
                    return res.redirect('back');
                });
            });
        }
    });
};