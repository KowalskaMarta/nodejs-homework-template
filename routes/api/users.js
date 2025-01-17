import express from "express";

import { registerUser } from "#controllers/users/registerUser.js";
import { loginUser } from "#controllers/users/loginUser.js";
import { logoutUser } from "#controllers/users/logoutUser.js";
import { auth } from "#controllers/users/auth.js";
import { currentUser } from "#controllers/users/currentUser.js";
import { updateAvatarUser } from '#controllers/users/updateAvatarUser.js'
import { upload } from '../../upload.js'

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", auth, logoutUser);
router.get("/current", auth, currentUser);
router.patch('/avatars', auth, upload.single('avatar'), updateAvatarUser)
export { router };
