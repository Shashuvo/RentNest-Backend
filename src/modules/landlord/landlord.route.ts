import { Router } from "express"
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { landlordController } from "./landlord.controller";

const router = Router();

// create property
router.post("/properties", auth(Role.LANDLORD), landlordController.createProperty)


export const landlordRoutes = router;