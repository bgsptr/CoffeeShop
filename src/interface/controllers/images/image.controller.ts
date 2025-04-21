import { BadRequestException, Controller, HttpStatus, InternalServerErrorException, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ApiResponse } from "src/core/domain/interfaces/dtos/responses/api-response.dto";
import { FileRequest } from "src/interface/middlewares/file.middleware";
import { GoogleCloudBucketUtil } from "src/utils/bucket.util";

@Controller('images')
export class ImageController {

    @Post('upload/buffer')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageFromMemoryToBucket(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        if (!file) throw new BadRequestException("No file uploaded.");

        if (file.size > 1000000) throw new BadRequestException("File must not be larger than 1MB");

        const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
        }

        const googleCloudBucket = new GoogleCloudBucketUtil();

        try {
            const bucketName = process.env.BUCKET_NAME ?? `clinic-mate`;
            const folderPath = process.env.DEST_FILE_PATH ?? `cafe-candra`;
            const uniqueFileName = `${folderPath}/${Date.now()}-${file.originalname}`

            const fileUrl = await googleCloudBucket.uploadImageToBucketFromMemory(file, bucketName, uniqueFileName);
            const response = new ApiResponse(res, HttpStatus.CREATED, 'file successfully uploaded', fileUrl);
            response.send();

        } catch(err) {
            console.log(err);
            throw new InternalServerErrorException(err);
        }
    }
}