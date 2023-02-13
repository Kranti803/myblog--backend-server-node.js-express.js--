import { Blog } from './../models/blogModel.js';
import cloudinary from 'cloudinary';
import { getDataUri } from '../utils/dataUri.js';
import { catchAsyncError } from '../middlewares/catchAsynError.js';
import { ErrorHandler } from './../utils/ErrorHandler.js';
import { User } from './../models/userModel.js';



// get all blogs..
export const getAllBlogs = catchAsyncError(async (req, res, next) => {

    const search = req.query.search || '';

    const category = req.query.category || '';


    const blogs = await Blog.find({
        title: {
            $regex: search,
            $options: 'i'
        },
        category: {
            $regex: category,
        }
    });

    res.status(200).json({
        success: true,
        blogs
    })
})



//get single blog...
export const getSingleBlog = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) return next(new ErrorHandler('Blog not found', 400));


    res.status(200).json({
        success: true,
        blog
    })
})






// add comments in blog Posts ....(both user and admin)
export const addComments = catchAsyncError(async (req, res, next) => {

    const { comment } = req.body;

    const { id } = req.params;


    const user = await User.findById(req.user._id);


    const blog = await Blog.findById(id);

    const commentDetails = {
        user: req.user.id,
        name: req.user.name,
        avtarUrl: req.user.avtar.url,
        comment,
    }

    blog.comments.push(commentDetails);

    await blog.save();


    res.status(200).json({
        success: true,
        user,

        message: "Comment added successfully",
    })
})


// delete comments in blog Posts ....(both user and admin)
export const deleteComments = catchAsyncError(async (req, res, next) => {


    const { id } = req.params;

    const { commentId } = req.params;

    const blog = await Blog.findById(id);

    const comments = blog.comments.filter((comment) => comment._id.toString() !== commentId.toString());

    blog.comments = comments;
    await blog.save()


    res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    })
})








//create a new blog....admin
export const createNewBlog = async (req, res, next) => {

    const { title, content, category } = req.body;

    const file = req.file;

    if (!title || !content || !category || !file) {
        return next(new ErrorHandler('Please fill all the data', 400));
    }

    const author = {
        name:req.user.name,
        avtarUrl:req.user.avtar.url
    }


    const fileUri = getDataUri(file);


    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await Blog.create({
        title,
        content,
        category,
        poster: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        },
        author
    })

    res.status(201).json({
        success: true,
        message: 'Blog created successfully'

    })

}



//update  a  blog....admin
export const updateBlog = async (req, res, next) => {

    const { id } = req.params;

    const file = req.file;

    let blog = await Blog.findById(id);



    if (!blog) {

        return next(new ErrorHandler('This blog doesnot exists', 400));
    }


    blog = await Blog.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    })

    if (file) {

        const fileUri = getDataUri(file);

        const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);


        if (blog.poster.public_id !== myCloud.public_id) {

            await cloudinary.v2.uploader.destroy(blog.poster.public_id);
        }

        blog.poster = {

            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }

        await blog.save({ validateBeforeSave: false });

    }




    res.status(201).json({
        success: true,
        message: "Blog updated successfully",
        blog

    })

}












//delete  a  blog....admin
export const deleteBlog = async (req, res, next) => {

    const { id } = req.params;


    let blog = await Blog.findById(id);


    if (!blog) {

        return next(new ErrorHandler('This blog doesnot exists', 400));
    }


    await Blog.findByIdAndDelete(id);


    await cloudinary.v2.uploader.destroy(blog.poster.public_id);


    res.status(201).json({
        success: true,
        message: "Blog deleted successfully",

    })

}
