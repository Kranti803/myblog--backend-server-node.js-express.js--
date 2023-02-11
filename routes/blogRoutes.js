import express from 'express'
import { isAdmin, isAuthenticated } from '../middlewares/auth.js';
import { addComments, createNewBlog, deleteBlog, deleteComments, getAllBlogs, getSingleBlog, updateBlog } from './../controllers/blogcontroller.js';
import { signleUpload } from './../middlewares/multer.js';

const router = express.Router();

//get all blogs...
router.route('/blogs').get(getAllBlogs);

//get single blog...
router.route('/blog/:id').get(getSingleBlog);


//add comments in blog posts...(both user and admin)
router.route('/blogs/addcomments/:id').post(isAuthenticated,addComments);


//delete comments in blog posts...(both user and admin)
router.route('/blogs/:id/deletecomments/:commentId').delete(isAuthenticated,deleteComments);


// create new blog --admin
router.route('/create').post(isAuthenticated,isAdmin,signleUpload,createNewBlog);

// update a blog --admin
router.route('/update/:id').put(isAuthenticated,isAdmin,signleUpload,updateBlog);

// delete a blog --admin
router.route('/delete/:id').delete(isAuthenticated,isAdmin,deleteBlog);




export default router;