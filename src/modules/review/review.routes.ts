import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";


const router = Router();

// create review
router.post("/", auth(Role.TENANT), reviewController.createReview)

export const reviewRoutes = router;