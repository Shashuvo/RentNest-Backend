import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// get all users
const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        omit: { password: true },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

// update user status
const updateUserStatus = async (userId: string, payload: { status: UserStatus; }) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: payload.status,
        },
        omit: {
            password: true,
        },
    });
    return result;
};
// get all properties
const getAllPropertiesForAdmin = async () => {
    const result = await prisma.property.findMany({
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                },
            },
            _count: {
                select: {
                    reviews: true,
                    rentalRequests: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
// get all rentals
const getAllRentalsForAdmin = async () => {
    const result = await prisma.rentalRequest.findMany({
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: {
                include: {
                    category: true,
                },
            },
            payment: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllPropertiesForAdmin,
    getAllRentalsForAdmin
}