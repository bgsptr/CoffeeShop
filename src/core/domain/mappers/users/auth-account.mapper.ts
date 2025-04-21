// import { UserEntity } from "../../entities/user.entity";
// import { LoginDto } from "../../interfaces/dtos/users/login.dto";
// import { RegisterDto } from "../../interfaces/dtos/users/register.dto";
// import { ResponseDto } from "../../interfaces/dtos/users/response.dto";
// import { IMapper } from "../../interfaces/providers/mapper.provider.interface";

// export class AuthAccountMapper implements IMapper<RegisterDto | LoginDto, User, ResponseDto> {
//     mapFromDto(input: RegisterDto | LoginDto): UserEntity {
//         const { email, password } = input;
//         return new UserEntity(
//             email,
//             password
//         )
//     }

//     mapToResponseJson(status: boolean, status_codes: number, message: string, result?: any, output?: UserEntity): ResponseDto {
//         return new ResponseDto(
//             status,
//             status_codes,
//             message,
//             result
//         )
//     }
// }