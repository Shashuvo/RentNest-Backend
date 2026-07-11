import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();
// webhook
router.post("/confirm", paymentController.handleWebhook);
// create payment
router.post("/create", auth(Role.TENANT), paymentController.createCheckoutSession);
// get payments
router.get("/", auth(Role.TENANT, Role.ADMIN), paymentController.getMyPayments);
// get payment by id
router.get("/:paymentId", auth(Role.TENANT, Role.ADMIN), paymentController.getPaymentById);

export const paymentRoutes = router; 