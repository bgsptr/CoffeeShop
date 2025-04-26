import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FindEmail } from 'src/core/domain/decorators/get-user-email.decorator';
// import { FetchRoles } from "src/core/domain/decorators/roles.decorator";
import { CoreUserInformationDto } from 'src/core/domain/interfaces/dtos/users/core-user-information.dto';
import { LoginDto } from 'src/core/domain/interfaces/dtos/users/login.dto';
import { RegisterDto } from 'src/core/domain/interfaces/dtos/users/register.dto';
import { RolesGuard } from 'src/core/domain/guards/role.guard';
import { GetBiodata } from 'src/use-cases/users/get-biodata/get-biodata.use-case';
import { Login } from 'src/use-cases/users/login/login.use-case';
import { Register } from 'src/use-cases/users/register/register.use-case';
import { UpdateRoleOrDataUserUsecase } from 'src/use-cases/users/change-data/change-data.use-case';
import { GetRoleUsecase } from 'src/use-cases/users/get-roles/get-role.use-case';
import { ApiResponse } from 'src/core/domain/interfaces/dtos/responses/api-response.dto';
import { OAuth2Google } from 'src/use-cases/auth/oauth2google.use-case';
import { Response } from 'express';
// import { UpdateAccount } from "src/use-cases/users/update-account/update-account.use-case";

@Controller('users')
export class UserController {
  constructor(
    private readonly getBiodataUseCase: GetBiodata,
    private readonly getRoleUsecase: GetRoleUsecase,
    private readonly register: Register,
    private readonly login: Login,
    private readonly oAuth2Google: OAuth2Google,
    // private readonly updateRoleOrDataUserUsecase: UpdateRoleOrDataUserUsecase,
  ) {}

  // @Roles(['patient, admin, doctor'])
  @Get('me')
  findMyInformation(@FindEmail() email: string) {
    console.log('email me', email);
    return this.getBiodataUseCase.execute(email);
  }

  @Get('hello-world')
  helloWorld() {
    return "Hello World";
  }

  @Post('register')
  registerAccount(@Body() registerDto: RegisterDto) {
    return this.register.execute(registerDto);
  }

  @Post('login')
  async loginAccount(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const token = await this.login.execute(loginDto);

      // res.cookie('token', token, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: 'lax',
      // });

      // res.cookie('token', token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'none',
      //   domain: 'coffeeshop-web-799300494910.asia-southeast2.run.app',
      //   path: '/',
      // });

      const response = new ApiResponse(
        res,
        HttpStatus.OK,
        'Successfully Login',
        token,
      );
      return response.send();
    } catch (error) {
      const data = JSON.parse(error?.message);
      console.log(data);
      throw new HttpException(
        {
          error: true,
          message: data?.message,
        },
        data?.statusCode,
        {
          cause: error,
        },
      );
    }
  }

  @Get('role')
  async getRoleUser(@FindEmail() email: string, @Res() res: Response) {
    try {
      const role = await this.getRoleUsecase.execute(email);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        role,
      });
    } catch (error) {
      const data = JSON.parse(error?.message);
      console.log(data);
      throw new HttpException(
        {
          error: true,
          message: data?.message,
        },
        data?.statusCode,
        {
          cause: error,
        },
      );
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
    });
    return res.json({ message: 'Logged out successfully' });
  }

  @Get('oauth2/google')
  getUrlAuth(@Res() res: Response) {
    const authUrl = this.oAuth2Google.getAuth();
    const response = new ApiResponse(
      res,
      200,
      'url to login with google',
      authUrl,
    );
    response.send();
  }

  @Get('auth/google/callback')
  async fetchAuthCodeFromCallbackUrl(
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    const token = await this.oAuth2Google.saveOAuthToJwtAndRedirect(code);

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'lax',
    // });

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   domain: 'coffeeshop-web-799300494910.asia-southeast2.run.app',
    //   path: '/',
    // });

    // res.redirect('http://localhost:5173/menu');
    res.redirect(`https://coffeeshop-web-799300494910.asia-southeast2.run.app/menu`);
  }

  // @Put(':email/role')
  // async changeRoleOrPrivacyInfo(@Param() email: string) {
  //     // await this.updateRoleOrDataUserUsecase.execute();
  // }

  // @Put('/')
  // updateProfile(@Body() userDto: CoreUserInformationDto) {
  //     return this.updateAccount.execute(email, userDto)
  // }
}
