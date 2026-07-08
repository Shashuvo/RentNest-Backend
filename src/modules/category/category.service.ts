import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";
import { appError } from "../../utils/appError";
import { ICreateCategoryPayload } from "./category.interface";

// create category
const createCategory = async (payload: ICreateCategoryPayload) => {
    const { name } = payload;
    const result = await prisma.category.create({
        data: {
            name: name
        }
    });

    return result;
};

// get all category
const getAllCategories = async () => {
    const result = await prisma.category.findMany();
    return result;
};


// delete category
const deleteCategory = async (categoryId: string) => {
    const isCategoryExist = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if (!isCategoryExist) {
        throw new appError("Category not found", httpStatus.NOT_FOUND);
    }

    await prisma.category.delete({
        where: {
            id: isCategoryExist.id
        }
    })

    return null;
};

export const categoryService = {
    createCategory,
    getAllCategories,
    deleteCategory
}