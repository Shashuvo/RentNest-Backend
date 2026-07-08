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

export const authRoutes = router;