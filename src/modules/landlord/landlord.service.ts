import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { CreatePropertyPayload, UpdatePropertyPayload } from "./landlord.interface";
import httpStatus from "http-status";

// create property
const createProperty = async (payload: CreatePropertyPayload, landlordId: string) => {
    const result = await prisma.property.create({
        data: {
            ...payload,
            landlordId
        },
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true
                }
            }
        }
    });

    return result;
};

// update property
const updateProperty = async (landlordId: string, propertyId: string, payload: UpdatePropertyPayload) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (property.landlordId !== landlordId) {
        throw new appError("You are not the owner of this property. You can not edit this property.", httpStatus.FORBIDDEN);
    }

    const result = await prisma.property.update({
        where: { id: propertyId },
        data: payload,
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                },
            },
        },
    });
    return result;
};

// delete a property
const deleteProperty = async (landlordId: string, propertyId: string, isAdmin: boolean) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId
        }
    })
    if (!isAdmin || property.landlordId !== landlordId) {
        throw new appError("You are not allowed delete this property.", httpStatus.FORBIDDEN)
    }

    await prisma.property.delete({
        where: {
            id: propertyId
        }
    })
    return null;
};

// get landlord requests
const getLandlordRequests = async (landlordId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId,
            },
        },
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: {
                include: { category: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};

export const landlordService = {
    createProperty,
    updateProperty,
    deleteProperty,
    getLandlordRequests
}