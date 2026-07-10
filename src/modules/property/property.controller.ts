import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import { appError } from '../../utils/appError';

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

//get property by id
const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId;
    if (!propertyId) {
        throw new appError("Property ID is required", httpStatus.BAD_REQUEST);
    }
    const result = await propertyService.getPropertyById(propertyId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property retrieved successfully",
        data: result
    })
});

export const propertyController = {
    getAllProperties,
    getPropertyById
}