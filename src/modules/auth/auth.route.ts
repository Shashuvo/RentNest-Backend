import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// register a user 
router.post("/register", authController.registerUser);

// login a user
router.post("/login", authController.loginUser);

export const authRoutes = router;