const Post=require('../models/posts');
const Comment=require('../models/comment');
const Like=require('../models/likes');
module.exports.create=async function(req,res){
    try {
        let post=await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post,
                    userName:req.user.name
                },
                message:"Post created"
            });
        }
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
            /*
            await Comment.deleteMany({_id: {$in: post.comments}});

            await Like.deleteMany({onModel:'Post',likeable:post.id});
            await Post.findByIdAndDelete(post.id);
            let assoComment=
            await Comment.deleteMany({post:post.id});*/
            // Delete likes associated with the post
            await Like.deleteMany({ likeable: post.id ,onModel:'Post'});

            // Find all comments associated with the post
            //const comments = await Comment.find({ post: post.id });

            // Delete likes associated with the comments on the post from the likes collection
            //const commentIds = comments.map((comment) => comment._id);
            await Like.deleteMany({ likeable: { $in: post.comments } , onModel: 'Comment' });

            // Delete comments associated with the post
            await Comment.deleteMany({ post: post.id });
            await post.deleteOne();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"post deleted"
                });
            }
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