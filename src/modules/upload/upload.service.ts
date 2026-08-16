import { v2 as cloudinary } from "cloudinary";
import config from "../../config";

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

const uploadImages = async (files: Express.Multer.File[]) => {
    const uploadPromises = files.map(
        (file) =>
            new Promise<{
                url: string;
                publicId: string;
            }>((resolve, reject) => {
                const uploadStream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "property-images",
                            resource_type: "image",
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                                return;
                            }

                            if (!result) {
                                reject(
                                    new Error(
                                        "Image upload failed."
                                    )
                                );
                                return;
                            }

                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                            });
                        }
                    );

                uploadStream.end(file.buffer);
            })
    );

    return Promise.all(uploadPromises);
};

const uploadProfileImage = async (
    file: Express.Multer.File
) => {
    return new Promise<{
        url: string;
        publicId: string;
    }>((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "profile-images",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!result) {
                        reject(
                            new Error(
                                "Profile image upload failed."
                            )
                        );
                        return;
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );

        uploadStream.end(file.buffer);
    });
};

export const uploadService = {
    uploadImages,
    uploadProfileImage
};