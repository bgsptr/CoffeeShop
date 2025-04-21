import { MiddlewareConsumer, Module } from "@nestjs/common";
import { OrderItemController } from "./order-item.controller";
import { DeleteSpecificItemInCart } from "src/use-cases/order/delete-spec-item-cart.use-case";
import { UpdateCartItemUsecase } from "src/use-cases/order/update-cart-item.use-case";
import { OrderItemRepository } from "src/infrastructure/repositories/order-item.repository";
import { Prisma } from "@prisma/client";
import { AuthMiddleware } from "src/interface/middlewares/auth.middleware";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";

@Module({
    controllers: [OrderItemController],
    providers: [
        OrderItemRepository,
        OrderRepository,
        {
            provide: DeleteSpecificItemInCart,
            useFactory: (
                orderItemRepository: OrderItemRepository,
                orderRepository: OrderRepository
            ) => new DeleteSpecificItemInCart(orderItemRepository, orderRepository),
            inject: [OrderItemRepository, OrderRepository]
        },
        {
            provide: UpdateCartItemUsecase,
            useFactory: (
                orderItemRepository: OrderItemRepository,
                orderRepository: OrderRepository,
            ) => new UpdateCartItemUsecase(orderItemRepository, orderRepository, (value) => new Prisma.Decimal(value)),
            inject: [OrderItemRepository, OrderRepository]
        }
    ]
})

export class OrderItemModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes('/order_items');
    }   
}