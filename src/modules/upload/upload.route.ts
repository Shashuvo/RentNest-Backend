import { Router } from "express";
import multer from "multer";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { uploadController } from "./upload.controller";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    },
});

router.post("/images", auth(Role.LANDLORD, Role.ADMIN), upload.array("images", 10), uploadController.uploadImages);

router.post("/profile-image",auth( Role.TENANT,Role.LANDLORD,Role.ADMIN ), upload.single("image"),uploadController.uploadProfileImage);

export const uploadRoutes = router;