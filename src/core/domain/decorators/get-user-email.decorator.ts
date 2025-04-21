import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const FindUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.userId;
    }
)

export const FindEmail = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.email;
    }
)