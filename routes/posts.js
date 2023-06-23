const express= require('express');
const passport=require('passport');
const router=express.Router();
const posts_controller=require('../controllers/posts_controller');
router.post('/create',passport.checkAuthentication,posts_controller.create);
router.get('/destroy/:id',passport.checkAuthentication,posts_controller.destroy);
module.exports=router;