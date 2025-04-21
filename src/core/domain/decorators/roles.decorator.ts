// import { SetMetadata } from "@nestjs/common";
import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Role } from "../interfaces/dtos/users/core-user-information.dto";
// import { Role } from "@prisma/client";
// import { Reflector } from "@nestjs/core";

// export const Roles = Reflector.createDecorator<string[]>();

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);


export const FetchRoles = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.role;
    }
)