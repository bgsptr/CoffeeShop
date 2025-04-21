import { Injectable, NestMiddleware } from "@nestjs/common";
import { AuthenticatedRequest } from "./auth.middleware";
import { Response, NextFunction } from "express";

@Injectable()
export class RoleMiddleware implements NestMiddleware {
    use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        if (!req?.user && !req.user?.email) return res.status(401).json({
            error: true,
            message: "user is not authorized"
        })
    }
}