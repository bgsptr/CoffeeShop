import { UserRepository } from "src/infrastructure/repositories/user.repository";

export class GetRoleUsecase {
    constructor(private userRepository: UserRepository) {}

    execute = async (email: string) => {
        return await this.userRepository.findRoleByEmail(email);
    }
}