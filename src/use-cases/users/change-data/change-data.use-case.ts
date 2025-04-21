import { UserRepository } from "src/infrastructure/repositories/user.repository";

export class UpdateRoleOrDataUserUsecase {
    constructor(
        public userRepository: UserRepository,

    ) {}

    async execute(email: string, selectedRole: string) {
        await this.userRepository.findRoleByEmail(email)
    }
}