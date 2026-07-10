import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import { appError } from '../../utils/appError';

// create a review
const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;
    const result = await reviewService.createReview(payload, tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review submitted successfully.",
        data: result
    })
});
// get property review
const getPropertyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId as string;
    if (!propertyId) {
      throw new appError("Property ID is required", httpStatus.BAD_REQUEST);
    }
    const result = await reviewService.getPropertyReviews(propertyId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews retrieved successfully.",
        data: result
    })
});

export const reviewController = {
    createReview,
    getPropertyReviews
}