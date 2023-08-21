const Post=require('../models/posts');
const Comment=require('../models/comment');
const commentsMailer=require('../mailers/comment_mailer');
const commentEmailWorker=require('../workers/comment_email_worker');
const queue=require('../config/kue');
const Like=require('../models/likes');
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
            console.log('jojo');
            /*comment=await comment.populate({
                path:'post user',
                select:'name email',
                popluate:{
                    path:'user',
                    select:'name email'
                }
            });*/
            comment = await comment.populate({
                path: 'post',
                select:'user',
                populate: {
                  path: 'user',
                  select: 'email name'
                }
              });
            comment=await comment.populate({
                path: 'user',
                select: 'name'
            });  
            console.log(comment);
            //commentsMailer.newComment(comment);
            let job=queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('error in pushing job in queue',err);
                    return;
                }
                console.log('job enqueued ',job.id);
            });
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
            await Post.findByIdAndUpdate(comment.post,{$pull:{comments:req.params.id}});
            await Like.deleteMany({likeable:comment.id,onMode:'Comment'});
            await comment.deleteOne();
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