import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import { appError } from '../../utils/appError';

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
});
// update property
const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const payload = req.body;
    const landlordId = req.user?.id as string;
    const result = await landlordService.updateProperty(landlordId, propertyId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property updated successfully.",
        data: result
    })
});

// delete property
const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const landlordId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    if (!propertyId) {
        throw new appError("Please provide a property id", httpStatus.BAD_REQUEST);
    }
    const result = await landlordService.deleteProperty(landlordId, propertyId, isAdmin);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully.",
        data: result
    })
});

export const landlordController = {
    createProperty,
    updateProperty,
    deleteProperty
}