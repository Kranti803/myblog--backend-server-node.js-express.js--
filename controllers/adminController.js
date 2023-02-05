import { catchAsyncError } from '../middlewares/catchAsynError.js';
import { ErrorHandler } from './../utils/ErrorHandler.js';
import { User } from './../models/userModel.js';
import { Blog } from './../models/blogModel.js';
import { sendEmail } from '../../../mern/backend/utils/sendEmail.js';



// get all users..
export const getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find({});

    res.status(200).json({
        success: true,
        users
    })

})



//contact us...

export const contactUs = catchAsyncError(async (req, res, next) => {

    const { name, email,subject, message } = req.body;

    if (!name || !email || !subject || !message) return next(new ErrorHandler('Please fill the field'), 400)

    const to = process.env.MY_MAIL;

    console.log(process.env.MY_MAIL);

    const text = `I am ${name} and my email is ${email}. \n ${message}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success: true,
        message: "Your Message has been sent ! "
    })
})


// change role...
export const changeRole = catchAsyncError(async (req, res, next) => {

    
    const user = await User.findById(req.query.id);

    if(!user) return next(new ErrorHandler('User doesnot exists'));

    
    if (user.role === 'user') user.role = 'admin';
    else user.role = 'user';
    
    await user.save();

    res.status(200).json({
        success: true,
        message:"Role changed successfully",
    })

})


// change blog featured type...
export const changeFeatured = catchAsyncError(async (req, res, next) => {

    
    const blog = await Blog.findById(req.query.id);

    if(!blog) return next(new ErrorHandler('Blog doesnot exists'));

    
    if (blog.featured) blog.featured = false;
    
    else blog.featured = true;
    
    await blog.save();

    res.status(200).json({
        success: true,
        message:"Blog featured changed successfully",
    })

})


