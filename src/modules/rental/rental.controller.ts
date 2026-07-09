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

// get my rental request
const getMyRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await rentalService.getMyRentalRequests(tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All of your rental request retrieved successfully.",
        data: result
    })
});

// get my rental request by id
const getMyRentalRequestsById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const requestId = req.params.requestId as string;
    const result = await rentalService.getMyRentalRequestsById(requestId, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request retrieved successfully.",
        data: result
    })
});

export const rentalController = {
    createRentalRequests,
    getMyRentalRequests,
    getMyRentalRequestsById
}