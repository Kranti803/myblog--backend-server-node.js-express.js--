import express from 'express';
import { changeFeatured, changeRole, contactUs, deleteUser, getAllUsers } from '../controllers/adminController.js';
import { isAuthenticated,isAdmin } from '../middlewares/auth.js';

const router = express.Router();

//get all user 
router.route('/admin/users').get(isAuthenticated,isAdmin,getAllUsers);

//change role 
router.route('/admin/changerole').put(isAuthenticated,isAdmin,changeRole);

//change role 
router.route('/admin/deleteUser').delete(isAuthenticated,isAdmin,deleteUser);


//change featured type 
router.route('/admin/changefeatured').put(isAuthenticated,isAdmin,changeFeatured);







//contact us form
router.route('/admin/contact').post(isAuthenticated,contactUs);

export default router;