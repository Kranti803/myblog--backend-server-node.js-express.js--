import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { changePassword, deleteMyprofile, forgotPassword, getMyProfile, loginUser, logoutUser, registerUser, resetPassword, updateProfile, updateProfilePic } from './../controllers/userController.js';
import { signleUpload } from './../middlewares/multer.js';

const router = express.Router();

//register new user..
router.route('/register').post(signleUpload,registerUser);

//login  user..
router.route('/login').post(loginUser);

//logout  user..
router.route('/logout').get(logoutUser);

//get my profile 
router.route('/me').get(isAuthenticated,getMyProfile);

//change password 
router.route('/changepassword').put(isAuthenticated,changePassword);

//update profile 
router.route('/updateprofile').put(isAuthenticated,updateProfile);

//update profile pic 
router.route('/updateprofilepic').put(isAuthenticated,signleUpload,updateProfilePic);

//forgot password.. 
router.route('/forgotpassword').post(forgotPassword);

// reset password 
router.route('/resetpassword/:token').put(resetPassword);

// delete my profile 
router.route('/deletemyprofile').delete(isAuthenticated,deleteMyprofile);



export default router;