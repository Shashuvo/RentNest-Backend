import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { LoginPayload, RegisterUserPayload, UpdateUserPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";

// register a user into db
const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, role, phone, address, photoUrl } = payload;
    if (!name || !email || !password) {
        throw new appError("Name, Email & Password are mandatory required.", httpStatus.BAD_REQUEST);
    }

    if (role && !["TENANT", "LANDLORD"].includes(role)) {
        throw new appError("Role must be TENANT or LANDLORD", httpStatus.BAD_REQUEST);
    }

    const isUserExists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isUserExists) {
        throw new appError("User with this email already exists", httpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: (role as "TENANT" | "LANDLORD") ?? "TENANT",
            status: "ACTIVE",
            phone,
            address,
            photoUrl
        }
    });

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: createUser.email,
            id: createUser.id
        },
        omit: {
            password: true
        }
    });

    return user;

};

// login user into db
const loginUser = async (payload: LoginPayload) => {
    const { email, password } = payload;
    if (!email || !password) {
        throw new appError("Email & Password is required.", httpStatus.BAD_REQUEST);
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new appError("Invalid email.", httpStatus.UNAUTHORIZED);
    }

    if (user.status === "BANNED") {
        throw new appError("Account is banned. Please support contact.", httpStatus.FORBIDDEN);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new appError("Invalid password.", httpStatus.UNAUTHORIZED)
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return { accessToken, refreshToken };
};

// get me
const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })
    if (!user) {
        throw new appError("User not found.", httpStatus.NOT_FOUND);
    }
    return user;
};

// update me
const updateMe = async (userId: string, payload: UpdateUserPayload) => {
    const { name, email, phone, address, photoUrl } = payload
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            email,
            phone,
            address,
            photoUrl
        },
        omit: {
            password: true
        }
    })
    if (!user) {
        throw new appError("User not found.", httpStatus.NOT_FOUND);
    }
    return user;
};

// refresh token
const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(
        refreshToken,
        config.jwt_refresh_secret
    );

    if (!verifiedRefreshToken.success) {
        throw new appError(verifiedRefreshToken.error, httpStatus.UNAUTHORIZED);
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    if (user.status === "BANNED") {
        throw new appError("Account is banned. Please support contact.", httpStatus.FORBIDDEN);
    }

    const JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        JwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    return { accessToken };
}

export const authService = {
    registerUserIntoDB,
    loginUser,
    getMe,
    updateMe,
    refreshToken
}