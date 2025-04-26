import { LoginDto } from "src/core/domain/interfaces/dtos/users/login.dto";
// import { AuthAccountMapper } from "src/core/domain/mappers/users/auth-account.mapper";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { Hasher } from "src/provider/bcrypt.provider";
import * as jwt from 'jsonwebtoken';

export class CustomHTTPError extends Error {

    constructor(public message: string, public statusCode: number) {
        super(message);
    }
}

export class Login {
    constructor(
        private readonly userRepository: UserRepository,
        private hasher: Hasher,
        // private authAccountMapper: AuthAccountMapper
    ) {}

    async execute(loginDto: LoginDto): Promise<any> {
        // const { email, password } = this.authAccountMapper.mapFromDto(loginDto);

        const { email, password } = loginDto; 

        const user = await this.userRepository.findByEmail(email).catch(error => {
            console.log('user tidak ditemukan')
            const data = {
                statusCode: 401,
                message: `email not found on database`
            }
            throw new Error(JSON.stringify(data));
        });

        const passwordIsMatch  = await this.hasher.compare(password, user?.password);
        if (!passwordIsMatch) {
            console.log('password salah')
            const data = {
                statusCode: 401,
                message: 'password is not match'
            }
            throw new Error(JSON.stringify(data));
        }

        const accessToken = jwt.sign(
            { userId: user.id, email: email, role: user.role }, 
            // process.env.SECRET_KEY || "secret", 
            "secret", 
            { expiresIn: '1h' }
        );

        return accessToken;

        // return this.authAccountMapper.mapToResponseJson(
        //     false,
        //     200,
        //     "User successfully authenticated",
        //     passwordIsMatch && {
        //         token: accessToken,
        //         expiredToken: ""
        //     }
        // )
    
    }
}