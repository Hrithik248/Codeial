const Post=require('../models/posts');
const Users=require('../models/user');
module.exports.home=async function(req,res){
    //console.log(req.cookies);
    try {
        let Posts= await Post.find({}).sort('-createdAt').populate('user').populate({
            path:'comments',
            options: { sort: { 'createdAt': -1 } },
            populate:{
                path:'user'
            }
        });
        let users= await Users.find({});
        let friends=[];
        //console.log(req.user);
        if(req.user){
            const user = await Users.findById(req.user._id).populate({
                path: 'friendships',
                populate: {
                  path: 'to_user from_user',
                  select:'name',
                  model: 'User'
                }
            });
          
            if (user) {
                // Extract friend information from the populated friendships field
                friends = user.friendships.map(friendship => {
                  if (friendship.from_user._id.equals(user._id)) {
                    return friendship.to_user;
                  } else {
                    return friendship.from_user;
                  }
                });
                //console.log(friends);
            }
        }
        return res.render('home',{
            title:'Home | Codeial',
            Posts,
            all_users:users,
            all_friends:friends
        });

    } catch (error) {
        console.log(error);
        req.flash('error','Error in loading posts and comments');
        //console.log('Error in loading posts and comments',error);
        return;
    }
};