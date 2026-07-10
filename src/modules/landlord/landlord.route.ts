import { Router } from "express"
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { landlordController } from "./landlord.controller";

const router = Router();

// create property
router.post("/properties", auth(Role.LANDLORD), landlordController.createProperty);
// update property
router.put("/properties/:propertyId", auth(Role.LANDLORD), landlordController.updateProperty);
// delete property
router.delete("/properties/:propertyId", auth(Role.LANDLORD, Role.ADMIN), landlordController.deleteProperty);
// get landlord requests
router.get("/requests", auth(Role.LANDLORD), landlordController.getLandlordRequests);


export const landlordRoutes = router;