import express from 'express';
import { loginUser, registerUser, logoutUser,uploadPhoto,updateUser,setUserCredentialAdmin,getCurrentUser,forgotPassword,resetPassword} from '../controllers/use.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { protect } from '../middlewares/auth.middleware.js';
import {isAdmin}  from '../middlewares/Check.middleware.js'
import {requireFeature} from '../middlewares/requireAccess.js';
const router = express.Router();

router.post('/register',upload.single("profilePhoto"),protect,requireFeature("User"), registerUser);
router.post('/login', loginUser);
router.post('/logout',protect, logoutUser);
router.post("/uploadPhoto/:userId",upload.single("profilePhoto"),protect,requireFeature("User"), uploadPhoto );
router.put('/update', protect, updateUser);
router.get('/me', protect, getCurrentUser);
router.post('/forgot-password',forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.put('/setCredential',protect,isAdmin, setUserCredentialAdmin);
export default router;

