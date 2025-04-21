import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // console.log(context);
        console.log("check role");

        // set key of metadata that same in role decorator for parameter 1 in reflector.get() method
        const rolesInHandlerLevel: Role[] = this.reflector.get<Role[]>('roles', context.getHandler()) ?? [];

        console.log("selected controller: ", context.getHandler())

        console.log("role: ", rolesInHandlerLevel);

        if (rolesInHandlerLevel.length === 0) {
            return true;
        }

        if (!rolesInHandlerLevel.every(role => Object.values(Role).includes(role))) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest() // user: { email, role };

        return rolesInHandlerLevel.includes(user?.role)
    }
}