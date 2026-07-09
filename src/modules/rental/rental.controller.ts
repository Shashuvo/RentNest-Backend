import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";

// create a rental request
const createRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;
    const result = await rentalService.CreateRentalRequest(tenantId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request submitted to landlord successfully.",
        data: result
    })
});

export const rentalController = {
    createRentalRequests
}