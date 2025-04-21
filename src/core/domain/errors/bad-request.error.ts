import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomHTTPError } from "./custom-http.error";

export class BadRequest extends CustomHTTPError {
    constructor(message: string) {
        super(message, "BAD_REQUEST")
    }
}