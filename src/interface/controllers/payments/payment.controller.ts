import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  FindEmail,
  FindUserId,
} from 'src/core/domain/decorators/get-user-email.decorator';
import { BadRequest } from 'src/core/domain/errors/bad-request.error';
import { PaymentDto } from 'src/core/domain/interfaces/dtos/payments/payment.dto';
import { ApiResponse } from 'src/core/domain/interfaces/dtos/responses/api-response.dto';
import { FetchAllOrderPaymentUsecase } from 'src/use-cases/payments/admins/fetch-all-payment.use-case';
import { MakePaymentUsecase } from 'src/use-cases/payments/make-payment.use-case';
import { MidtransUsecase } from 'src/use-cases/payments/midtrans/midtrans.use-case';
import { FetchChargeRequestUsecase } from 'src/use-cases/payments/fetch-charge-request.use-case';
import { PaymentListUsecase } from 'src/use-cases/payments/payment-list.use-case';
import { MidtransPaymentNotificationDto } from 'src/core/domain/interfaces/dtos/payments/payment-notification.dto';
import { ConflictError } from 'src/core/domain/errors/conflict.error';
import { UnprocessableError } from 'src/core/domain/errors/unprocessable.error';
import { OrderDashboardAdminUsecase } from 'src/use-cases/payments/admins/order-dashboard.use-case';
import { DashboardPaymentUsecase } from 'src/use-cases/payments/admins/dashboard-order-payment.use-case';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly makePaymentUsecase: MakePaymentUsecase,
    private readonly fetchAllOrderPaymentUsecase: FetchAllOrderPaymentUsecase,
    private readonly fetchChargeRequestUsecase: FetchChargeRequestUsecase,
    private readonly midtransUsecase: MidtransUsecase,
    private readonly paymentListUsecase: PaymentListUsecase,
    private readonly fetchDashboardPaymentUsecase: DashboardPaymentUsecase
  ) {}

  @Post()
  async createPayment(
    @Res() res: Response,
    @Body() paymentDto: PaymentDto,
    @FindEmail() email: string,
    @FindUserId() userId: string,
  ) {
    try {
      const payment = await this.makePaymentUsecase.execute(
        paymentDto,
        email,
        userId,
      );

      const response = new ApiResponse(
        res,
        200,
        `create payment with id ${payment.id}`,
        payment,
      );
      response.send();
    } catch (err) {
      if (err instanceof BadRequest)
        throw new BadRequestException(err?.message);

      if (err instanceof ConflictError)
        throw new ConflictException(err?.message);

      if (err instanceof UnprocessableError)
        throw new UnprocessableEntityException(err?.message);

      throw err;
    }
  }

  // @Post('online')
  // async createPaymentNonCash(
  //   @Res() res: Response,
  //   @Body() paymentDto: PaymentDto,
  //   @FindEmail() email: string,
  // ) {
  //   try {
  //     // await this.payment;

  //     const paymentCustomersData = await this.fetchChargeRequestUsecase.execute(
  //       paymentDto,
  //       email,
  //     );

  //     const chargeResponse =
  //       paymentDto.paymentType === 'qris'
  //         ? await this.midtransUsecase.getQrisCode(paymentCustomersData)
  //         : await this.midtransUsecase.payWithVirtualAccount(
  //             paymentCustomersData,
  //             paymentDto.paymentType,
  //           );

  //     const response = new ApiResponse(
  //       res,
  //       200,
  //       `successfully fetch all payment customers`,
  //       paymentCustomersData,
  //     );
  //     response.send();
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  @Get()
  async adminFetchPayment(@Res() res: Response) {
    try {
      const dataMidtransTransaction =
        await this.fetchAllOrderPaymentUsecase.execute();
      const response = new ApiResponse(
        res,
        200,
        `create new payment online`,
        dataMidtransTransaction,
      );
      response.send();
    } catch (err) {
      throw err;
    }
  }

  @Get('list/online')
  async fetchPaymentOnlineTransaction(
    @Res() res: Response,
    @FindEmail() email: string,
  ) {
    try {
      const result = await this.paymentListUsecase.execute(email);
      const response = new ApiResponse(
        res,
        200,
        `success fetch list online payment and order history`,
        result,
      );
      response.send();
    } catch (err) {
      throw err;
    }
  }

  @Post('notification')
  async webhooksMidtransNotification(
    @Res() res: Response,
    @Body() body: MidtransPaymentNotificationDto,
  ) {
    try {
      await this.midtransUsecase.paymentNotification(body);
      const response = new ApiResponse(
        res,
        200,
        'handler accept midtrans webhooks',
      );
      response.send();
    } catch (err) {
      throw err;
    }
  }

  @Get('list/orders')
  async paymentOrder(@Res() res: Response) {
    try {
      const datas = await this.fetchDashboardPaymentUsecase.execute();

      const response = new ApiResponse(
        res,
        200,
        'handler accept midtrans webhooks',
        datas
      );
      response.send();

    } catch(err) {
      throw err;
    }
  }
}
