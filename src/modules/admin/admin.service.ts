import { RentalStatus, UserStatus, } from "../../../generated/prisma/enums";

import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";

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

// update rental status for admin
const updateRentalStatusForAdmin = async (requestId: string, payload: { status: RentalStatus }) => {
    const request = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: requestId,
        },
        include: {
            property: true,
        },
    });

    if (
        (payload.status === "APPROVED" ||
            payload.status === "REJECTED") &&
        request.status !== "PENDING"
    ) {
        throw new appError(
            "Only pending requests can be approved or rejected.",
            httpStatus.BAD_REQUEST
        );
    }

    if (
        payload.status === "COMPLETED" &&
        request.status !== "ACTIVE"
    ) {
        throw new appError(
            "Only active rentals can be marked as completed.",
            httpStatus.BAD_REQUEST
        );
    }

    // When an active rental is completed,
    // make the property available again.
    if (payload.status === "COMPLETED") {
        const [result] = await prisma.$transaction([
            prisma.rentalRequest.update({
                where: {
                    id: requestId,
                },
                data: {
                    status: "COMPLETED",
                },
                include: {
                    tenant: {
                        omit: {
                            password: true,
                        },
                    },
                    property: true,
                },
            }),

            prisma.property.update({
                where: {
                    id: request.propertyId,
                },
                data: {
                    isAvailable: true,
                },
            }),
        ]);

        return result;
    }

    // APPROVED / REJECTED
    const result = await prisma.rentalRequest.update({
        where: {
            id: requestId,
        },
        data: {
            status: payload.status,
        },
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: true,
        },
    });

    return result;
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllPropertiesForAdmin,
    getAllRentalsForAdmin,
    updateRentalStatusForAdmin
}