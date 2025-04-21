import { Repository } from "src/core/base/repository";
import { UserEntity } from "../../entities/user.entity";
import { User } from "@prisma/client";

export interface IUserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
    updateByEmail(email: string, data: User): Promise<void>;
}