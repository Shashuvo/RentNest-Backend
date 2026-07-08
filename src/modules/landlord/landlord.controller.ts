import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";

// create property
const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const landlordId = req.user?.id as string;
    const property = await landlordService.createProperty(payload,landlordId);
})

export const landlordController = {
    createProperty
}