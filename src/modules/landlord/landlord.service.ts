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
}

export const landlordService = {
    createProperty,
    updateProperty
}