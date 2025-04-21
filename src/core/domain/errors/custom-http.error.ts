import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomHTTPError extends Error {
    constructor(
        public message: string,
        public code?: string
    ) {
        super(message);
        this.name = "CustomHTTPError";
    }
}