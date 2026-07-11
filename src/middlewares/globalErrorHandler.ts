import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

interface PrismaError extends Error {
    code?: string;
    meta?: unknown;
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";

    const prismaErr = err as PrismaError;

    if (prismaErr?.code === "P2002") {
        res.status(httpStatus.CONFLICT).json({
            success: false,
            statusCode: httpStatus.CONFLICT,
            name: "PrismaClientKnownRequestError",
            message: "Already exists.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    if (prismaErr?.code === "P2025") {
        res.status(httpStatus.NOT_FOUND).json({
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            name: "PrismaClientKnownRequestError",
            message: "Record not found.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    if (prismaErr?.code === "P2003") {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            name: "PrismaClientKnownRequestError",
            message: "Invalid reference to a related record.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    if (prismaErr?.code === "P2014") {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            name: "PrismaClientKnownRequestError",
            message: "Invalid relation between records.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    if (prismaErr?.code === "P2011") {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            name: "PrismaClientKnownRequestError",
            message: "A required field is missing.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    if (prismaErr?.code === "P2000") {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            name: "PrismaClientKnownRequestError",
            message: "Provided value is too long for the field.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    if (prismaErr?.code?.startsWith("P2")) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            name: "PrismaClientKnownRequestError",
            message: "Database request error.",
            error: prismaErr.meta ?? null
        });
        return;
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    })
}