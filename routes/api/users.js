import express from "express";

import { registerUser } from "#controllers/users/registerUser.js";
import { loginUser } from "#controllers/users/loginUser.js";
import { logoutUser } from "#controllers/users/logoutUser.js";
import { auth } from "#controllers/users/auth.js";
import { currentUser } from "#controllers/users/currentUser.js";
import { updateAvatarUser } from '#controllers/users/updateAvatarUser.js'
import { upload } from '../../upload.js'
import { verificationTokenUser } from '#controllers/users/verificationTokenUser.js'
import { resendVerificationTokenUser } from '#controllers/users/resendVerificationTokenUser.js'


const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", auth, logoutUser);
router.get("/current", auth, currentUser);
router.patch('/avatars', auth, upload.single('avatar'), updateAvatarUser)
router.get('/verify/:verificationToken', verificationTokenUser)
router.post('/verify/', resendVerificationTokenUser)
export { router };
