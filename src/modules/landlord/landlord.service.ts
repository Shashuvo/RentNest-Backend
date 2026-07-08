import { prisma } from "../../lib/prisma";
import { CreatePropertyPayload } from "./landlord.interface"

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

    return result
}

export const landlordService = {
    createProperty
}