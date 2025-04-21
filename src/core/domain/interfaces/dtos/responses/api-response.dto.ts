import { CookieOptions, Response } from "express";

export class ApiResponse<T> {
    constructor(
        public res: Response,
        public statusCode: number,
        public message: string,
        public result?: T,
        public success?: boolean
    ) {
        this.success = statusCode < 400;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    getDefaultCookieOption(): CookieOptions {
        return {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        }
    }

    send(): Response {
        const statusCode = this.getStatusCode();
        return this.res.status(statusCode).json({
            success: this.success!,
            statusCode: statusCode,
            message: this.message,
            result: this.result ?? null,
        })
    }

    pushCookie(cookieKey: string, cookieValue: string): void {
        const cookieOptions = this.getDefaultCookieOption()
        this.res.cookie(cookieKey, cookieValue, cookieOptions);
    }
}