import mongoose from "mongoose";
import validator from "validator";
import jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name']
    },
    email: {
        type: String,
        required: [true, 'Please Enter your Email'],
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, 'Please Enter your Password'],
        minLength: [8, 'Password must br greater than 7 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    avtar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },

    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,

})
userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        return next();
    }
    const hashedPassword = await bcrypt.hash(this.password,10);

    this.password = hashedPassword;
    next();

})

userSchema.methods.getJWTToken = function(){

    return jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:'15d',

    })
    
}
userSchema.methods.comparePassword = async function(passedPassword){

    return await bcrypt.compare(passedPassword,this.password);
    
}
userSchema.methods.getResetToken = async function(){

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now()+ 10*60*1000;

    return resetToken;


    
}

export const User = mongoose.model('User', userSchema);