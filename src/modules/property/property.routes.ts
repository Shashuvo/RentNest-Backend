import { Router } from "express";
import { propertyController } from "./property.controller";

const router = Router();

// get all properties
router.get("/", propertyController.getAllProperties);
// get properties by id
router.get("/:propertyId", propertyController.getPropertyById);

export const propertyRoutes = router;