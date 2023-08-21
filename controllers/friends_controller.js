const Friendship=require('../models/friendships');
const User=require('../models/user');
module.exports.toggleFriend=async function(req,res){
    try {
        const query = {
            $or: [
              { from_user: req.user.id, to_user: req.query.profile },
              { to_user: req.user.id, from_user: req.query.profile },
            ]
          };
        let existingFriendship= await Friendship.findOne(query);
        let add=true;
        if(existingFriendship){
            await User.findByIdAndUpdate(existingFriendship.from_user,{$pull:{friendships:existingFriendship._id}});
            await User.findByIdAndUpdate(existingFriendship.to_user,{$pull:{friendships:existingFriendship._id}});
            await existingFriendship.deleteOne();
            add=false;
        }
        else{
            let newFriendship= await Friendship.create({
                from_user:req.user._id,
                to_user:req.query.profile
            });
            await User.findByIdAndUpdate(newFriendship.from_user,{$push:{friendships:newFriendship._id}});
            await User.findByIdAndUpdate(newFriendship.to_user,{$push:{friendships:newFriendship._id}});
        }
        return res.status(200).json({
            message:'Friendship added successfully',
            data:{
                add
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Internal Server Error'
        });
    }
};