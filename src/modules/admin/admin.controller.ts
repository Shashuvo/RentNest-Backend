import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";
import { appError } from "../../utils/appError";

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result,
    });
},
);
// update user status
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId as string;
    if (!userId) {
        throw new appError("User ID is required", httpStatus.BAD_REQUEST);
    }
    const payload = req.body;
    const result = await adminService.updateUserStatus(
        userId,
        payload,
    );
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: result,
    });
},
);
// get all properties
const getAllPropertiesForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllPropertiesForAdmin();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties retrieved successfully",
        data: result,
    });
},
);
// get all rentals
const getAllRentalsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalsForAdmin();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rentals retrieved successfully",
        data: result,
    });
},
);


export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllPropertiesForAdmin,
    getAllRentalsForAdmin
}