const express= require('express');
const router= express.Router();
console.log('router loaded');
const home_controller=require('../controllers/home_controller');
router.get('/',home_controller.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comment',require('./comments'));
module.exports=router;