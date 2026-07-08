import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";

// create categories
const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category = await categoryService.createCategory(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully.",
        data: category
    });
});

// get all categories
const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allCategories = await categoryService.getAllCategories();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All categories retrieved successfully.",
        data: allCategories
    });
});

// delete category
const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    const result = await categoryService.deleteCategory(categoryId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category deleted successfully.",
        data: result
    });
});

export const categoryController = {
    createCategory,
    getAllCategories,
    deleteCategory
}