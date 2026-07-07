import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { appError } from "../utils/appError";
import httpStatus from "http-status"
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if (!token) {
            throw new appError("You are not logged in.", httpStatus.UNAUTHORIZED);
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new appError(verifiedToken.error, httpStatus.UNAUTHORIZED);
        }

        const { id, name, email, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new appError("You don't have access to this resource.", httpStatus.FORBIDDEN);
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            throw new appError("User not found.", httpStatus.NOT_FOUND);
        }

        if (user.status === "BANNED") {
            throw new appError("Your account is banned. Please contact support.", httpStatus.FORBIDDEN);
        }

        req.user = {
            id,
            email,
            name,
            role
        };

        next();
    })
}