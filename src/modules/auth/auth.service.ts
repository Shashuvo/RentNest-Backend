import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { LoginPayload, RegisterUserPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

// register a user into db
const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, role, phone, address, photoUrl } = payload;
    if (!name || !email || !password) {
        throw new appError("Name, Email & Password are mandatory required.", 400);
    }

    if (role && !["TENANT", "LANDLORD"].includes(role)) {
        throw new appError("Role must be TENANT or LANDLORD", 400);
    }

    const isUserExists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isUserExists) {
        throw new appError("User with this email already exists", 409);
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
        throw new appError("Email & Password is required.", 400);
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new appError("Invalid email.", 401);
    }

    if (user.status === "BANNED") {
        throw new appError("Account is banned. Please support contact.", 403);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new appError("Invalid password.", 401)
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
}

export const authService = {
    registerUserIntoDB,
    loginUser
}