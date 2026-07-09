import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// create a rental request
router.post("/", auth(Role.TENANT), rentalController.createRentalRequests);
// get rental request
router.get("/", auth(Role.TENANT), rentalController.getMyRentalRequests);
// get rental request by id
router.get("/:requestId", auth(Role.TENANT), rentalController.getMyRentalRequestsById)

export const rentalRoutes = router;