import { CustomHTTPError } from "./custom-http.error";

export class UnprocessableError extends CustomHTTPError {
    constructor(message: string) {
        super(message, "UNPROCESSABLE_ENTITY")
    }
}