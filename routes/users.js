const express= require('express');
const passport=require('passport');
const router=express.Router();
const user_controller=require('../controllers/users_controller');
router.get('/profile/:id',passport.checkAuthentication,user_controller.profile);
router.post('/update/:id',passport.checkAuthentication,user_controller.update);
router.get('/sign-up',user_controller.signUp);
router.get('/sign-in',user_controller.signIn);
router.post('/create',user_controller.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
),user_controller.createSession);
router.get('/sign-out',user_controller.destroySession);
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),user_controller.createSession);
router.get('/forgot_password',user_controller.forgot_password);
router.post('/reset_token',user_controller.sendToken);
router.get('/reset_password/:accessToken',user_controller.resetPassword);
router.post('/reset_password/:accessToken',user_controller.setNewPassword);
module.exports=router;