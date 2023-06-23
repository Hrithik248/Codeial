const Post=require('../models/posts');
const Users=require('../models/user');
module.exports.home=async function(req,res){
    //console.log(req.cookies);
    try {
        let Posts= await Post.find({}).populate('user').populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
        let users= await Users.find({});
        return res.render('home',{
            title:'Home | Codeial',
            Posts,
            all_users:users
        });

    } catch (error) {
        console.log('Error in loading posts and comments',error);
        return;
    }
};