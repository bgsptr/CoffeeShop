import { Body, Controller, Get, HttpStatus, NotFoundException, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SessionId } from 'src/core/domain/decorators/get-sessionid.decorator';
import { FindUserId } from 'src/core/domain/decorators/get-user-email.decorator';
import { CustomNotFoundError } from 'src/core/domain/errors/not-found.error';
import { CheckoutDto } from 'src/core/domain/interfaces/dtos/checkouts/checkout.dto';
import { ApiResponse } from 'src/core/domain/interfaces/dtos/responses/api-response.dto';
import { FetchCheckoutUsecase } from 'src/use-cases/sessions/fetch-checkout.use-case';
import { GenerateSessionCheckout } from 'src/use-cases/sessions/generate-session-checkout.use-case';

@Controller('sessions')
export class SessionController {
  constructor(
    private generateSessionCheckout: GenerateSessionCheckout,
    private fetchCheckoutUsecase : FetchCheckoutUsecase
  ) {}

  @Post('checkout')
  async generate(@Res() res: Response, @Body() checkoutDto: CheckoutDto, @FindUserId() userId: string) {
    try {
      const { key, value } =
        await this.generateSessionCheckout.execute({...checkoutDto, user_id: userId }, userId);

      const response = new ApiResponse(
        res,
        HttpStatus.OK,
        'Successfully generate new checkout session',
        // {
        //   checkoutSessionId: value,
        // },
      );

      response.pushCookie(key, value);
      response.send();

    } catch (err) {
      throw err;
    }
  }

  @Get('checkout')
  async fetchCheckout(@Res() res: Response, @FindUserId() userId: string) {
    try {
      const sessionData =
        await this.fetchCheckoutUsecase.execute(userId);

      const response = new ApiResponse(
        res,
        HttpStatus.OK,
        'Successfully generate new checkout session',
        {
          data: sessionData,
        },
      );

      response.send();

    } catch (err) {
      if (err instanceof CustomNotFoundError) {
        throw new NotFoundException(err?.message);
      }
      throw err;
    }
  }
}
