import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// create payment
const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const { rentalRequestId } = req.body;
    const result = await paymentService.createCheckoutSession(rentalRequestId, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout session created successfully",
        data: result,
    });
},
);

// webhook
const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook triggered successfully",
        data: null,
    });
},
);

// get payments
const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const userRole = req.user?.role as string;
    const result = await paymentService.getMyPayments(userId, userRole,);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payments retrieved successfully",
        data: result,
    });
},
);

// get payment by id
const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const userRole = req.user?.role as string;
    const paymentId = req.params.paymentId as string;
    const result = await paymentService.getPaymentById(paymentId, userId, userRole,);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment retrieved successfully",
        data: result,
    });
},
);

export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getMyPayments,
    getPaymentById,
};