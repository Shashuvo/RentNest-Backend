import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();

// create category
router.post("/", auth(Role.ADMIN), categoryController.createCategory);

// get all categories
router.get("/", categoryController.getAllCategories);

// delete category
router.delete("/:categoryId", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;