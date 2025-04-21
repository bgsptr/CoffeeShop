import { CustomHTTPError } from "./custom-http.error";

export class ConflictError extends CustomHTTPError {
    constructor(message: string) {
        super(message, "CONFLICT")
    }
}