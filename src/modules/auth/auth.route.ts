import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

// register a user 
router.post("/register", authController.registerUser);

// login a user
router.post("/login", authController.loginUser);

// get me
router.get("/me", auth(), authController.getMe);

// update me
router.patch("/update-me", auth(), authController.updateMe);

export const authRoutes = router;