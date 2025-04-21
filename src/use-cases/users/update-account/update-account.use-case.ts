// import { CoreUserInformationDto } from "src/core/domain/interfaces/dtos/users/core-user-information.dto";
// import { CorePatientMapper } from "src/core/domain/mappers/users/core-patient.mapper";
// import { UserRepository } from "src/infrastructure/repositories/user.repository";

// export class UpdateAccount {
//     constructor(
//         public userRepository: UserRepository,
//         public corePatientMapper: CorePatientMapper
//     ) {}

//     async execute(email: string, userDto: CoreUserInformationDto) {
//         const userEntity = this.corePatientMapper.mapFromDto(userDto, email);
//         await this.userRepository.updateByEmail(email, userEntity);
//     }
// }