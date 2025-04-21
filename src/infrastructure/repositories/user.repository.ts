import { Role } from "src/core/domain/interfaces/dtos/users/core-user-information.dto";
import { UserEntity } from "../../core/domain/entities/user.entity";
import { IUserRepository } from "../../core/domain/interfaces/repositories/user.repository.interface";
import { BaseRepository } from "./base.repository";
import { User } from "@prisma/client";

export class UserRepository extends BaseRepository implements IUserRepository {
    
    async findByEmail(email: string): Promise<User> {
        return await this.prisma.user.findFirstOrThrow({
            where: {
                email: email
            }
        })
    }

    async updateByEmail(email: string, data: User): Promise<void> {
        
    }

    // bug potential
    async create(data: Partial<User>): Promise<any> {
        return await this.prisma.user.create({
            data: {
                id: data.id,
                email: String(data.email),
                password: String(data.password),
                role: Role.CUSTOMER,
                phone: "",
                name: "",
            }
        })
    }

    async findRoleByEmail(email: string): Promise<string> {
        const { role } = await this.prisma.user.findUniqueOrThrow({
            where: { email },
            select: {
                role: true
            }
        })
        return role!;
    }

    async updateRoleByEmail(email: string, role: Role): Promise<void> {
        await this.prisma.user.update({
            where: { email },
            data: {
                role
            }
        })
    }

    async findByEmailWithoutError(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                email
            }
        }) || null
    }
}
