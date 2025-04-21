import { CustomHTTPError } from "./custom-http.error";

export class ForbiddenError extends CustomHTTPError {
    constructor(message: string) {
        super(message, "FORBIDDEN")
    }
}