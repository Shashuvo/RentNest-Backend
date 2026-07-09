import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { CreateRentalRequestPayload } from "./rental.interface";
import httpStatus from "http-status"

// create rental request 
const CreateRentalRequest = async (tenantId: string, payload: CreateRentalRequestPayload) => {
    const propertyId = payload.propertyId;
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: payload.propertyId
        }
    });

    if (!property.isAvailable) {
        throw new appError("This property is not available.", httpStatus.BAD_REQUEST);
    };

    if (property.landlordId === tenantId) {
        throw new appError("You can not rent your own property.", httpStatus.BAD_REQUEST);
    };

    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            propertyId,
            tenantId,
            status: { in: ["PENDING", "ACTIVE", "APPROVED"] }
        }
    });

    if (existingRequest) {
        throw new appError("You already have an active rental request for this property.", httpStatus.BAD_REQUEST);
    };

    const result = await prisma.rentalRequest.create({
        data: {
            ...payload,
            tenantId
        },
        include: {
            property: {
                include: { category: true }
            },
            tenant: { omit: { password: true } }
        }
    });

    return result;
};

// get my rental requests
const getMyRentalRequests = async (tenantId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            tenantId
        },
        include: {
            property: {
                include: {
                    category: true,
                    landlord: {
                        omit: { password: true }
                    }
                }
            },
            // payment:true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return result;
}

export const rentalService = {
    CreateRentalRequest,
    getMyRentalRequests
}