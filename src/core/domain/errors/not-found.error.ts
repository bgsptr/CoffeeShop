import { CustomHTTPError } from "./custom-http.error";

export class CustomNotFoundError extends CustomHTTPError {
    constructor(message: string) {
        super(message, "NOT_FOUND")
    }
}