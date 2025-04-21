import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ItemRepository } from 'src/infrastructure/repositories/item.repository';
import { DecimalProvider } from 'src/provider/decimal.provider';
import { AuthMiddleware } from 'src/interface/middlewares/auth.middleware';
import { FindOrderUsecase } from 'src/use-cases/order/find-order.use-case';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';
import { FetchOrderMapper } from 'src/core/domain/mappers/orders/fetch-order.mapper';
import { CleanOrderItemUsecase } from 'src/use-cases/order/clean-order-item.use-case';
import { OrderController } from './order.controller';
import { NewOrderUsecase } from 'src/use-cases/order/new-order.use-case';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { Prisma } from '@prisma/client';
import { GetItemsInFirstOrderUsecase } from 'src/use-cases/order/get-items-in-first-order.use-case';
import { OrderDashboardAdminUsecase } from 'src/use-cases/payments/admins/order-dashboard.use-case';
import { GetItemsParamOrderUsecase } from 'src/use-cases/order/get-items-param-order.use-case';
import { FetchAllOrderUsecase } from 'src/use-cases/order/fetch-all-order.use-case';

@Module({
  controllers: [OrderController],
  providers: [
    OrderRepository,
    ItemRepository,
    OrderItemRepository,
    UserRepository,
    FetchOrderMapper,
    DecimalProvider,
    {
      provide: FindOrderUsecase,
      useFactory: (
        itemRepository: ItemRepository,
        orderRepository: OrderRepository,
        orderItemRepository: OrderItemRepository,
        fetchOrderMapper: FetchOrderMapper,
      ) =>
        new FindOrderUsecase(
          orderRepository,
          itemRepository,
          orderItemRepository,
          fetchOrderMapper,
        ),
      inject: [
        ItemRepository,
        OrderRepository,
        OrderItemRepository,
        FetchOrderMapper,
      ],
    },
    {
      provide: CleanOrderItemUsecase,
      useFactory: (
        orderItemRepository: OrderItemRepository,
        orderRepository: OrderRepository,
      ) => new CleanOrderItemUsecase(orderItemRepository, orderRepository),
      inject: [OrderItemRepository, OrderRepository],
    },
    {
      provide: NewOrderUsecase,
      useFactory: (
        orderItemRepository: OrderItemRepository,
        orderRepository: OrderRepository,
        itemRepository: ItemRepository,
        userRepository: UserRepository,
      ) =>
        new NewOrderUsecase(
          orderRepository,
          itemRepository,
          orderItemRepository,
          userRepository,
          (value) => new Prisma.Decimal(value),
        ),
      inject: [
        OrderItemRepository,
        OrderRepository,
        ItemRepository,
        UserRepository,
      ],
    },
    {
      provide: GetItemsInFirstOrderUsecase,
      useFactory: (
        orderRepository: OrderRepository,
        orderItemRepository: OrderItemRepository,
      ) =>
        new GetItemsInFirstOrderUsecase(orderRepository, orderItemRepository),
      inject: [OrderRepository, OrderItemRepository],
    },
    {
      provide: OrderDashboardAdminUsecase,
      useFactory: (orderRepository: OrderRepository) =>
        new OrderDashboardAdminUsecase(orderRepository),
      inject: [OrderRepository],
    },
    {
      provide: GetItemsParamOrderUsecase,
      useFactory: (
        orderRepository: OrderRepository,
        orderItemRepository: OrderItemRepository,
      ) => new GetItemsParamOrderUsecase(orderRepository, orderItemRepository),
      inject: [OrderRepository, OrderItemRepository],
    },
    {
      provide: FetchAllOrderUsecase,
      useFactory: (orderRepository: OrderRepository) =>
        new FetchAllOrderUsecase(orderRepository),
      inject: [OrderRepository],
    },
  ],
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/orders');
  }
}
