import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { uploadService } from "./upload.service";

const uploadImages = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                statusCode: httpStatus.BAD_REQUEST,
                message: "Please provide at least one image.",
            });
        }

        const result =
            await uploadService.uploadImages(files);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Images uploaded successfully.",
            data: result,
        });
    }
);

export const uploadController = {
    uploadImages,
};