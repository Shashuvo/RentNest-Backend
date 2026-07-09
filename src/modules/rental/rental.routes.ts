import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// create a rental request
router.post("/", auth(Role.TENANT), rentalController.createRentalRequests);

export const rentalRoutes = router;