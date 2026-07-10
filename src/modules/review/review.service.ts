import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { CreateReviewPayload } from "./review.interface";
import httpStatus from "http-status";

// create review
const createReview = async (payload: CreateReviewPayload, tenantId: string) => {
    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: { id: payload.rentalRequestId },
    });

    if (rentalRequest.tenantId !== tenantId) {
        throw new appError("You are not authorized to review this rental.", httpStatus.FORBIDDEN);
    }

    if (rentalRequest.status === "COMPLETED") {
        throw new appError("You can only review the completed rentals.", httpStatus.BAD_REQUEST);
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            rentalRequestId: payload.rentalRequestId,
        },
    });

    if (existingReview) {
        throw new appError("You have already reviewed this rental.", httpStatus.BAD_REQUEST);
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new appError("Rating must be between 1 to 5.", httpStatus.BAD_REQUEST);
    }

    const result = await prisma.review.create({
        data: {
            ...payload,
            tenantId
        },
        include: {
            tenant: {
                omit: { password: true }
            },
            property: true
        }
    });

    return result;
};

export const reviewService = {
    createReview
}