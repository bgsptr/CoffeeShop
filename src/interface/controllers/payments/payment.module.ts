import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from 'src/infrastructure/repositories/payment.repository';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';
import { MakePaymentUsecase } from 'src/use-cases/payments/make-payment.use-case';
import { Prisma } from '@prisma/client';
import { FetchChargeRequestUsecase } from 'src/use-cases/payments/fetch-charge-request.use-case';
import { AuthMiddleware } from 'src/interface/middlewares/auth.middleware';
import { FetchAllOrderPaymentUsecase } from 'src/use-cases/payments/admins/fetch-all-payment.use-case';
import { MidtransUsecase } from 'src/use-cases/payments/midtrans/midtrans.use-case';
import { AxiosInstance } from 'axios';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';
import { ItemRepository } from 'src/infrastructure/repositories/item.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { QrisRepository } from 'src/infrastructure/repositories/qris.repository';
import { VirtualAccountRepository } from 'src/infrastructure/repositories/virtual-account.repository';
import { PaymentListUsecase } from 'src/use-cases/payments/payment-list.use-case';
import { OrderDetailUsecase } from 'src/use-cases/order/order-detail-service/order-detail.use-case';
import { AddressRepository } from 'src/infrastructure/repositories/address.repository';
import { DashboardPaymentUsecase } from 'src/use-cases/payments/admins/dashboard-order-payment.use-case';
import { RedisUsecase } from 'src/use-cases/redis/redis.use-case';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [PaymentController],
  providers: [
    PaymentRepository,
    OrderRepository,
    OrderItemRepository,
    ItemRepository,
    UserRepository,
    QrisRepository,
    VirtualAccountRepository,
    AddressRepository,
    RedisUsecase,
    {
      provide: MakePaymentUsecase,
      useFactory: (
        paymentRepository: PaymentRepository,
        orderRepository: OrderRepository,
        qrisRepository: QrisRepository,
        fetchChargeRequestUsecase: FetchChargeRequestUsecase,
        midtransUsecase: MidtransUsecase,
        addressRepository: AddressRepository,
        redisService: RedisUsecase,
      ) =>
        new MakePaymentUsecase(
          paymentRepository,
          orderRepository,
          qrisRepository,
          (value) => new Prisma.Decimal(value),
          fetchChargeRequestUsecase,
          midtransUsecase,
          addressRepository,
          redisService,
        ),
      inject: [
        PaymentRepository,
        OrderRepository,
        QrisRepository,
        FetchChargeRequestUsecase,
        MidtransUsecase,
        AddressRepository,
        RedisUsecase
      ],
    },
    {
      provide: FetchChargeRequestUsecase,
      useFactory: (
        orderItemRepository: OrderItemRepository,
        itemRepository: ItemRepository,
        userRepository: UserRepository,
      ) =>
        new FetchChargeRequestUsecase(
          orderItemRepository,
          itemRepository,
          userRepository,
        ),
      inject: [OrderItemRepository, ItemRepository, UserRepository],
    },
    {
      provide: FetchAllOrderPaymentUsecase,
      useFactory: (paymentRepository: PaymentRepository) =>
        new FetchAllOrderPaymentUsecase(paymentRepository),
      inject: [PaymentRepository],
    },
    {
      provide: MidtransUsecase,
      useFactory: (
        axiosClient: AxiosInstance,
        qrisRepository: QrisRepository,
        virtualAccountRepository: VirtualAccountRepository,
        paymentRepository: PaymentRepository,
        orderRepository: OrderRepository,
      ) =>
        new MidtransUsecase(
          axiosClient,
          qrisRepository,
          virtualAccountRepository,
          paymentRepository,
          orderRepository,
        ),
      inject: [
        'MIDTRANS_AXIOS',
        QrisRepository,
        VirtualAccountRepository,
        PaymentRepository,
        OrderRepository,
      ],
    },
    {
      provide: OrderDetailUsecase,
      useFactory: (
        orderItemRepository: OrderItemRepository,
        itemRepository: ItemRepository,
      ) => new OrderDetailUsecase(orderItemRepository, itemRepository),
      inject: [OrderItemRepository, ItemRepository],
    },
    {
      provide: PaymentListUsecase,
      useFactory: (
        paymentRepository: PaymentRepository,
        userRepository: UserRepository,
        orderDetailUsecase: OrderDetailUsecase,
      ) =>
        new PaymentListUsecase(
          paymentRepository,
          userRepository,
          orderDetailUsecase,
        ),
      inject: [PaymentRepository, UserRepository, OrderDetailUsecase],
    },
    {
      provide: DashboardPaymentUsecase,
      useFactory: (paymentRepository: PaymentRepository) =>
        new DashboardPaymentUsecase(paymentRepository),
      inject: [PaymentRepository],
    },
  ],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/payments');
  }
}
