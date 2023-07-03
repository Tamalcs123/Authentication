const router= require('express').Router();
const userControllers=require('../controllers/userControllers');
router.post('/register',userControllers.register);
router.post('/login',userControllers.login);
router.post('/forget-password',userControllers.forget_password)
module.exports=router;