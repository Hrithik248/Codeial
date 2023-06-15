const express= require('express');
const passport=require('passport');
const router=express.Router();
const user_controller=require('../controllers/users_controller');
router.get('/profile',user_controller.profile);
router.get('/sign-up',user_controller.signUp);
router.get('/sign-in',user_controller.signIn);
router.post('/create',user_controller.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
),user_controller.createSession)
module.exports=router;