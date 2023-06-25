const Post=require('../models/posts');
const Comment=require('../models/comment');
module.exports.create=async function(req,res){
    try {
        await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        req.flash('success','Post created Successfully');
        return res.redirect('back');
    } catch (error){
        req.flash('error','Error in creating post',error);
        //console.log('Error in creating post',error);
        return;
    }
};
module.exports.destroy=async function(req,res){
    try {
        let post= await Post.findById(req.params.id);
        if(post.user==req.user.id){
            await Post.findByIdAndDelete(post.id);
            await Comment.deleteMany({post:post.id});
            req.flash('success','Post deleted successfully');
            return res.redirect('back');
        }
        else{
            req.flash('error','You cannot delete this post');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error','Error in deleting post',error);
        //console.log('Error in deleting post',error);
        return;
    }
};