import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";

// create property
const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const landlordId = req.user?.id as string;
    const result = await landlordService.createProperty(payload, landlordId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully.",
        data: result
    })
})

export const landlordController = {
    createProperty
}