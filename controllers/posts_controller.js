const Post=require('../models/posts');
const Comment=require('../models/comment');
module.exports.create=async function(req,res){
    try {
        await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        return res.redirect('back');
    } catch (error) {
        console.log('Error in creating post',error);
        return;
    }
};
module.exports.destroy=async function(req,res){
    try {
        let post= await Post.findById(req.params.id);
        if(post.user==req.user.id){
            await Post.findByIdAndDelete(post.id);
            await Comment.deleteMany({post:post.id});
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error in deleting post',error);
        return;
    }
};