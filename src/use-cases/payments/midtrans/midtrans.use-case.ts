import { Inject } from '@nestjs/common';
import { OrderStatus, PaymentStatus, Qris } from '@prisma/client';
import { AxiosInstance } from 'axios';
import { midtrans } from 'src/core/contants/variable';
import { BadRequest } from 'src/core/domain/errors/bad-request.error';
import { ConflictError } from 'src/core/domain/errors/conflict.error';
import { MidtransPaymentNotificationDto } from 'src/core/domain/interfaces/dtos/payments/payment-notification.dto';
import { MidtransChargeRequest } from 'src/core/domain/interfaces/requests/midtrans-charge/midtrans-charge.request';
import { MidtransChargeResponse } from 'src/core/domain/interfaces/requests/midtrans-charge/response/midtrans-charge.response';
import { ChargeMidtransPaymentType } from 'src/core/domain/interfaces/types/enum.type';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';
import { PaymentRepository } from 'src/infrastructure/repositories/payment.repository';
import { QrisRepository } from 'src/infrastructure/repositories/qris.repository';
import { VirtualAccountRepository } from 'src/infrastructure/repositories/virtual-account.repository';
import { TimeUtil } from 'src/utils/time.util';

export class MidtransUsecase {
  constructor(
    @Inject('MIDTRANS_AXIOS') private readonly axiosClient: AxiosInstance,
    private readonly qrisRepository: QrisRepository,
    private readonly virtualAccountRepository: VirtualAccountRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async payWithQris(
    chargeMidtransRequest: MidtransChargeRequest,
    paymentId: string,
  ) {
    try {
      const response = await this.axiosClient.post(`/v2/charge`, {
        ...chargeMidtransRequest,
        payment_type: ChargeMidtransPaymentType.QRIS,
      });

      const responseBody: MidtransChargeResponse = response.data;

      console.log('response midtrans: ', responseBody);

      if (responseBody.status_code === '406')
        throw new ConflictError(responseBody.status_message);

      const allowedPaymentTypes = Object.values(PaymentStatus);
      const capitalPaymentStatus =
        responseBody.transaction_status.toUpperCase() as PaymentStatus;
      if (!allowedPaymentTypes.includes(capitalPaymentStatus))
        throw new BadRequest(`unknown payment type from midtrans`);

      const qrisBody: Qris = {
        id: responseBody.transaction_id,
        transactionTime: TimeUtil.parseStringToTimeDayJS(
          responseBody.transaction_time,
        ),
        transactionStatus: capitalPaymentStatus,
        fraudStatus: responseBody.fraud_status === 'accept' ? false : true,
        url: responseBody.actions[0].url,
        expiredAt: TimeUtil.parseStringToTimeDayJS(responseBody.expiry_time),
        qrString: responseBody.qr_string,
        paymentId,
      };

      return await this.qrisRepository.create(qrisBody);
    } catch (err) {
      // console.log('error in mdtrans qris body: ', err?.message);
      throw err;
    }
    // return responseBody
  }

  async payWithVirtualAccount(
    chargeMidtransRequest: MidtransChargeRequest,
    virtualAccountType: string,
    paymentId: string,
  ) {
    const response = await this.axiosClient.post('/v2/charge', {
      ...chargeMidtransRequest,
      payment_type: virtualAccountType,
    });

    return response.data;
  }

  async paymentNotification(body: MidtransPaymentNotificationDto) {
    console.log('midtrans usecase request body: ', body);

    const {
      transaction_id,
      transaction_status,
      payment_type,
      gross_amount,
      order_id,
      fraud_status,
    } = body;

    if (transaction_status === 'settlement') {
      await this.orderRepository.updateById(order_id, {
        status: OrderStatus.PREPARING,
      });

      switch (payment_type) {
        case 'qris':
          const paymentId =
            await this.qrisRepository.updateStatusToPaidWithTransactionId(
              transaction_id,
            );

          await this.paymentRepository.updateStatusToPaidByOrderId(paymentId);
          break;
      }
    }
  }
}
