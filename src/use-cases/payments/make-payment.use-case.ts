import { BadRequestException, Inject } from '@nestjs/common';
import {
  OrderStatus,
  Payment,
  PaymentStatus,
  PaymentType,
  Prisma,
} from '@prisma/client';
import { BadRequest } from 'src/core/domain/errors/bad-request.error';
import { PaymentDto } from 'src/core/domain/interfaces/dtos/payments/payment.dto';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';
import { PaymentRepository } from 'src/infrastructure/repositories/payment.repository';
import { v1 as uuidv1 } from 'uuid';
import { FetchChargeRequestUsecase } from './fetch-charge-request.use-case';
import { MidtransChargeRequest } from 'src/core/domain/interfaces/requests/midtrans-charge/midtrans-charge.request';
import { MidtransUsecase } from './midtrans/midtrans.use-case';
import { QrisRepository } from 'src/infrastructure/repositories/qris.repository';
import { CustomHTTPError } from 'src/core/domain/errors/custom-http.error';
import { ConflictError } from 'src/core/domain/errors/conflict.error';
import { TimeUtil } from 'src/utils/time.util';
import { AddressRepository } from 'src/infrastructure/repositories/address.repository';
import { UnprocessableError } from 'src/core/domain/errors/unprocessable.error';
import { RedisUsecase } from '../redis/redis.use-case';

export class MakePaymentUsecase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly qrisRepository: QrisRepository,
    @Inject('DECIMAL_FACTORY')
    private readonly numberToDecimal: (
      value: number | string,
    ) => Prisma.Decimal,
    private readonly fetchChargeRequestUsecase: FetchChargeRequestUsecase,
    private readonly midtransUsecase: MidtransUsecase,
    private readonly addressRepository: AddressRepository,
    private readonly redisService: RedisUsecase,
  ) {}

  async execute(paymentDto: PaymentDto, email: string, userId: string) {
    const constants = {
      SERVER_URL:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://coffeeshop-api-799300494910.asia-southeast2.run.app',
    };

    const { orderId, amount, paymentType, onlineMethod } = paymentDto;

    const typePayment = ['CASH', 'CARD', 'ONLINE'];
    const capitalPaymentType = paymentType.toUpperCase();

    const addressIsExist =
      await this.addressRepository.findSelectedAddress(userId);

    if (!addressIsExist)
      throw new UnprocessableError(
        `Address required before proceeding. Please create one at: ${constants.SERVER_URL}/addresses`,
      );

    if (!typePayment.includes(capitalPaymentType))
      throw new BadRequest(`${paymentType} is not part of PaymentType`);

    // const paymentCash = await this.paymentRepository.checkCashPaymentByOrderId(Number(orderId));
    const paymentCash = await this.paymentRepository.fetchAllPaymentsByOrderId(
      Number(orderId),
    );

    console.log('payment cash', paymentCash);

    if (paymentCash.find((pay) => pay.paymentType === PaymentType.CASH))
      throw new ConflictError(`payment with order id ${orderId} paid in COD`);

    const onlinePaymentIds = paymentCash
      .filter((pay) => pay.paymentType === PaymentType.ONLINE)
      .map((pay) => pay.id);

    console.log('online pay', onlinePaymentIds);

    const now = new Date();
    const utcMinusInMS = 1 * 3600 * 1000;
    const wibUtc = new Date(now.getTime() - utcMinusInMS);

    const currentDateTime = TimeUtil.parseTimeToStringExact(wibUtc);

    const expiredQris = await this.qrisRepository.checkExpiredQris(
      onlinePaymentIds,
      currentDateTime,
    );

    console.log('qris: ', expiredQris);

    if (expiredQris.length > 0)
      throw new ConflictError(
        `payment with order id ${orderId} is already exist for qris payment`,
      );

    // const { userId } = await this.orderRepository.findOrderById(orderId);

    const paymentTypeIsCard = paymentType === PaymentType.CARD;

    const paymentEntity: Payment = {
      id: uuidv1(),
      userId: Number(userId),
      orderId: parseInt(orderId, 10),
      paymentType: capitalPaymentType as PaymentType,
      // paymentStatus: paymentTypeIsCard
      //   ? PaymentStatus.PENDING
      //   : PaymentStatus.PAID,
      paymentStatus: PaymentStatus.PENDING,
      amount: this.numberToDecimal(amount),
      transactionDate: new Date(),
    };

    let paymentId: string;

    switch (paymentType) {
      case PaymentType.CARD.toLowerCase():
        break;
      case PaymentType.CASH.toLowerCase():
        await this.orderRepository.updateById(orderId, {
          status: OrderStatus.PREPARING
        })
        paymentId = await this.paymentRepository.create(paymentEntity);
        break;
      case PaymentType.ONLINE.toLowerCase():
        const order = await this.orderRepository.findOrderById(orderId);
        [paymentId] = await Promise.all([
          this.paymentRepository.create(paymentEntity),
          this.orderRepository.updateById(orderId, {
            totalPrice: order.totalPrice,
            status: OrderStatus.PREPARING,
            // if paid online set preparing, otherwise don't update
          }),
        ]);

        const midtransCharge: MidtransChargeRequest =
          await this.fetchChargeRequestUsecase.execute(
            paymentDto,
            email,
            paymentId,
            amount,
          );

        console.log('select online method');
        if (onlineMethod === 'qris') {
          const { expiredAt, transactionTime } =
            await this.midtransUsecase.payWithQris(midtransCharge, paymentId);
          await this.redisService.addJob({
            paymentId,
            expiredDate: expiredAt,
            transactionDate: transactionTime,
            orderId
          });
          console.log('qris method here');
        } else if (onlineMethod) {
          await this.midtransUsecase.payWithVirtualAccount(
            midtransCharge,
            onlineMethod,
            paymentId,
          );
        }
        break;
    }

    // add to shipping table

    // if (paymentTypeIsCard) {
    //   [paymentId] = await Promise.all([
    //     this.paymentRepository.create(paymentEntity),
    //     this.orderRepository.updateById(orderId, {
    //       totalPrice: this.numberToDecimal(amount),
    //       status: OrderStatus.PREPARING,
    //       // if paid online set preparing, otherwise don't update
    //     }),
    //   ]);
    // } else {
    //   paymentId = await this.paymentRepository.create(paymentEntity);
    // }

    return {
      ...paymentEntity,
      orderStatus: paymentTypeIsCard
        ? OrderStatus.PREPARING
        : OrderStatus.PENDING,
    };
  }
}
