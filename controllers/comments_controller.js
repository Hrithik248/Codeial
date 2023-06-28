const Post=require('../models/posts');
const Comment=require('../models/comment');
module.exports.create=async function(req,res){
    try {
        let post= await Post.findById(req.body.post_id);
        if(post){
            let comment= await Comment.create({
                content:req.body.content,
                post:req.body.post_id,
                user:req.user._id
            });
            post.comments.push(comment);
            post.save();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment,
                        userName:req.user.name
                    },
                    message:'comment added'
                });
            }
            req.flash('success','Comment added successfully');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error','Error in creating comment',error);
        //console.log('Error in creating comment',error);
        return;
    }
};
module.exports.destroy=async function(req,res){
    try {
        let comment= await Comment.findById(req.params.id);
        if(comment.user==req.user.id){
            await Comment.findByIdAndDelete(comment.id);
            await Post.findByIdAndUpdate(comment.post,{$pull:{comments:req.params.id}});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        //or req.params.id
                        comment_id:comment._id
                    },
                    message:'comment deleted'
                });
            }
            req.flash('success','Comment deleted successfully');
            return res.redirect('back');
        }
        else{
            req.flash('error','You cannot delete this comment');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error','Error in deleteing comment',error);
        //console.log('Error in deleteing comment',error);
        return;
    }
};