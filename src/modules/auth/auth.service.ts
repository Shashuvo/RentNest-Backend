import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { RegisterUserPayload } from "./auth.interface";
import config from "../../config";

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

export const authService = {
    registerUserIntoDB,
}