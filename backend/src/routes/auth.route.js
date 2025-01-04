import express from "express";
import {signup,login,logout,updateProfile,checkAuth,otpverification} from "../controllers/auth.controllers.js";
import { protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/verifyotp",otpverification);
router.post("/login",login);
router.post("/logout",logout);
router.put("/updateProfile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);

export default router;