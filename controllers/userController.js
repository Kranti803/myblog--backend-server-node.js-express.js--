import cloudinary from 'cloudinary';
import { getDataUri } from '../utils/dataUri.js';
import { catchAsyncError } from '../middlewares/catchAsynError.js';
import { ErrorHandler } from './../utils/ErrorHandler.js';
import { User } from './../models/userModel.js';
import { sendToken } from './../utils/sendToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

export const registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;

    const file = req.file;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all field", 400));
    }

    let user = await User.findOne({ email: email });

    if (user) return next(new ErrorHandler("User already exists", 409));

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        avtar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    })

    sendToken(res, user, 201, "Registered Successfully");



})

//login user..
export const loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;


    if (!email || !password) {
        return next(new ErrorHandler("Please fill all field", 400));
    }

    const user = await User.findOne({ email: email }).select('+password');

    if (!user) return next(new ErrorHandler('Invalid Email or Password ', 401));

    const isMatched = await user.comparePassword(password);

    if (!isMatched) return next(new ErrorHandler('Incorrect Email or Password', 401));

    sendToken(res, user, 201, "Logged in Successfully");


})



//logout user..
export const logoutUser = catchAsyncError(async (req, res, next) => {

    res.status(200).cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).json({
        success: true,
        message: "Logged out successfully"
    })


})



//get my profile..
export const getMyProfile = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    if(!user) return next(new ErrorHandler("User doesnot exists"))



    res.status(200).json({
        success: true,
        user
    })


})




//changepassword....
export const changePassword = catchAsyncError(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) return next(new ErrorHandler("Please fill all fields"));

    if (oldPassword === newPassword) return next(new ErrorHandler("Please Enter New Password"));

    const user = await User.findById(req.user._id).select('+password');

    const isMatched = await user.comparePassword(oldPassword);

    if (!isMatched) return next(new ErrorHandler('Old password is incorrect', 400));

    user.password = newPassword;

    await user.save();


    res.status(200).json({
        success: true,
        message: "Password Changed Successfully"
    })


})

//update my profile....
export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;

    if (email) user.email = email;



    await user.save();


    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully"
    })


})

//update my profile Picture....
export const updateProfilePic = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    const file = req.file;
    
    console.log(file);

    if (!file) return next(new ErrorHandler('Please select an image'));

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await cloudinary.v2.uploader.destroy(user.avtar.public_id);

    user.avtar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }


    await user.save();


    res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully"
    })


})






//forgot password....
export const forgotPassword = catchAsyncError(async (req, res, next) => {

    const {email} = req.body;

    if(!email) return next(new ErrorHandler('Please Enter Your Email Id'));

    const user = await User.findOne({email:email});

    if(!user) return next(new ErrorHandler('User doesnot exists',400));

    const resetToken = await user.getResetToken();
    
    await user.save();


    //sending token via email..

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset Your password . ${url}`;

    await sendEmail(user.email,"Blog website reset Password",message);




    res.status(200).json({
        success: true,
        message: `Reset link has been sent to ${user.email} `,
    })


})


//reset password....
export const resetPassword = catchAsyncError(async (req, res, next) => {

    const {token} = req.params;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt:Date.now(),
        }
    })

    if(!user) return next (new ErrorHandler("Reset Password Token is invalid or expired",401));

    user.password = req.body.password;

    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message:"Password changed successfully"
    })


})



// delete my profile....
export const deleteMyprofile = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    if(!user) return next(new ErrorHandler("user not found",400))


    await cloudinary.v2.uploader.destroy(user.avtar.public_id);

    await User.deleteOne(user._id);

    res.status(200).json({
        success: true,
        message:"Profile deleted successfully"
    })


})