const Like=require('../models/likes');
const Post=require('../models/posts');
const Comment=require('../models/comment');

module.exports.toggleLike=async function(req,res){
    try {
        //likes/toggle/?id=acd&type=post
        let likeable;
        let deleted=false;
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }
        //chech if a like already exists
        let existingLike=await Like.findOne({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
        });
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            //existingLike.remove();
            await existingLike.deleteOne();
              
            deleted=true;
        }
        else{
            let newLike=await Like.create({
                user:req.user._id,
                onModel:req.query.type,
                likeable:req.query.id
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.status(200).json({
            message:'Liked Succesfully',
            data:{
                deleted
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Internal Server Error'
        });
    }
} 