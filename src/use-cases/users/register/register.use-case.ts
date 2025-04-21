import { User } from '@prisma/client';
import {
  RegisterDto,
  RegisterKey,
} from 'src/core/domain/interfaces/dtos/users/register.dto';
// import { IHasher } from 'src/core/domain/interfaces/providers/bcrypt.provider.interface';
// import { AuthAccountMapper } from "src/core/domain/mappers/users/auth-account.mapper";
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { Hasher } from 'src/provider/bcrypt.provider';

export class Register {
  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher,
    // private authAccountMapper: AuthAccountMapper
  ) {}

  async execute(registerDto: RegisterDto): Promise<string> {
    const hashedPassword = await this.hasher.hash(registerDto.password);
    registerDto.set(RegisterKey.password, hashedPassword);

    if (!registerDto.email) throw new Error('err');

    try {
      const userEntity: Partial<User> = {
        email: registerDto.email,
        password: registerDto.password,
      };

      const data = await this.userRepository.create(userEntity);

      return userEntity.email!;
    } catch (error) {
      throw new Error(error);
    }
  }
}
