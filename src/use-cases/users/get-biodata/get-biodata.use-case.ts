import { UserRepository } from "src/infrastructure/repositories/user.repository";

export class GetBiodata {
    constructor(private userRepository: UserRepository) {}

    execute = async (email: string) => {
        return await this.userRepository.findByEmail(email);
    }
}