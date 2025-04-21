import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { CreateItemUsecase } from "src/use-cases/items/create-item.use-case";
import { ItemRepository } from "src/infrastructure/repositories/item.repository";
import { DecimalProvider } from "src/provider/decimal.provider";
import { Prisma } from "@prisma/client";
import { AuthMiddleware } from "src/interface/middlewares/auth.middleware";
import { FindItemUsecase } from "src/use-cases/items/find-item.use.case";
import { FetchItemsUsecase } from "src/use-cases/items/fetch-items.use-case";

@Module({
    controllers: [ItemController],
    providers: [
        ItemRepository,
        DecimalProvider,
        {
            provide: CreateItemUsecase,
            useFactory: (
                itemRepository: ItemRepository,
            ) => new CreateItemUsecase(itemRepository, (value) => new Prisma.Decimal(value)),
            inject: [ItemRepository]
        },
        {
            provide: FindItemUsecase,
            useFactory: (
                itemRepository: ItemRepository,
            ) => new FindItemUsecase(itemRepository),
            inject: [ItemRepository]
        },
        {
            provide: FetchItemsUsecase,
            useFactory: (
                itemRepository: ItemRepository
            ) => new FetchItemsUsecase(itemRepository),
            inject: [ItemRepository]
        }
    ],
})

export class ItemModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes('/items');
    }   
}