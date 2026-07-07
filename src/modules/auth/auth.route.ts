import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// register a user 
router.post("/register", authController.registerUser)

export const authRoutes = router;