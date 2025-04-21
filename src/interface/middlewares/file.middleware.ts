import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";
import multer from 'multer';

export interface FileRequest extends Request {
    file: Express.Multer.File;
}

@Injectable()
export class FileMiddleware implements NestMiddleware {
    use(req: FileRequest, res: any, next: (error?: any) => void) {
        const upload = multer({ storage: multer.memoryStorage() }).single("file");

        upload(req, res, (err: any) => {
            if (err) {
                return res.status(400).json({ error: "File upload failed" });
            }
            next();
        })
    }
}