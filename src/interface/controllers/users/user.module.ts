import { MiddlewareConsumer, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { Register } from "src/use-cases/users/register/register.use-case";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { Hasher } from "src/provider/bcrypt.provider";
import { GetBiodata } from "src/use-cases/users/get-biodata/get-biodata.use-case";
import { Login } from "src/use-cases/users/login/login.use-case";
import { AuthMiddleware } from "src/interface/middlewares/auth.middleware";
import { GetRoleUsecase } from "src/use-cases/users/get-roles/get-role.use-case";
import { OAuth2Google } from "src/use-cases/auth/oauth2google.use-case";
import { GoogleModule } from "src/config/oauth_google/google.module";
import { OAuth2Client } from 'google-auth-library';

@Module({
    imports: [GoogleModule],
    controllers: [UserController],
    providers: [
        UserRepository,
        Hasher,
        {
            provide: Register,
            useFactory: (
                userRepository: UserRepository, 
                hasher: Hasher,
            ) => new Register(userRepository, hasher),
            inject: [UserRepository, Hasher] 
        },
        {
            provide: GetBiodata,
            useFactory: (
                userRepository: UserRepository
            ) => new GetBiodata(userRepository),
            inject: [UserRepository]
        },
        {
            provide: Login,
            useFactory: (
                userRepository: UserRepository,
                hasher: Hasher,
            ) => new Login(userRepository, hasher),
            inject: [UserRepository, Hasher]
        },
        {
            provide: GetRoleUsecase,
            useFactory: (
                userRepository: UserRepository,
            ) => new GetRoleUsecase(userRepository),
            inject: [UserRepository]
        },
        {
            provide: OAuth2Google,
            useFactory: (
                oauth2Client: OAuth2Client,
                userRepository: UserRepository
            ) => new OAuth2Google(oauth2Client, userRepository),
            inject: ["GOOGLE_OAUTH", UserRepository]
        }
    ]
})

export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes('users/me', 'users/role');
    }
}