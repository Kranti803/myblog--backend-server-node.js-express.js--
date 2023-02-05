import jwt from 'jsonwebtoken'
import { catchAsyncError } from './catchAsynError.js'
import { ErrorHandler } from './../utils/ErrorHandler.js';
import { User } from '../models/userModel.js';

export const isAuthenticated = catchAsyncError(async(req,res,next)=>{

    const {token} = req.cookies;

    if(!token) return next(new ErrorHandler('Please login to access this resource'))

    const decodedData = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodedData._id);

    // console.log(req.user);

    next();

})


export const isAdmin = (req,res,next)=>{

    if(req.user.role !== 'admin') return next(new ErrorHandler('User is not allowed to access this resource',403));

    next();
}


