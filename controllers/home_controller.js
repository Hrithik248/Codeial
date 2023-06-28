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
        return res.render('home',{
            title:'Home | Codeial',
            Posts,
            all_users:users
        });

    } catch (error) {
        req.flash('error','Error in loading posts and comments',error);
        //console.log('Error in loading posts and comments',error);
        return;
    }
};