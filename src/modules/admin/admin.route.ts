import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

// get all users
router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
// update user status
router.patch("/users/:userId", auth(Role.ADMIN), adminController.updateUserStatus);
// get all properties
router.get("/properties", auth(Role.ADMIN), adminController.getAllPropertiesForAdmin);
// get all rentals
router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentalsForAdmin);

export const adminRoutes = router;