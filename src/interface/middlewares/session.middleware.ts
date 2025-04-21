import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { sessionId } = req.cookies;
        if (!sessionId) {
            return res.status(400).json({
                error: true,
                message: `cookie didn't containing session id`
            })
        }

        req.sessionId = sessionId;
        next();
    }
}
