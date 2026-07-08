import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";

// get all properties
const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertyService.getAllPropertiesFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All properties retrieved successfully",
        data: result.data,
        meta: result.meta
    })
});

export const propertyController = {
    getAllProperties
}