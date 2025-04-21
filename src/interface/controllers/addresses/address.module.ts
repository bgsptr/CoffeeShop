import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CreateItemUsecase } from "src/use-cases/items/create-item.use-case";
import { ItemRepository } from "src/infrastructure/repositories/item.repository";
import { DecimalProvider } from "src/provider/decimal.provider";
import { Prisma } from "@prisma/client";
import { AuthMiddleware } from "src/interface/middlewares/auth.middleware";
import { FindItemUsecase } from "src/use-cases/items/find-item.use.case";
import { FetchItemsUsecase } from "src/use-cases/items/fetch-items.use-case";
import { AddressController } from "./address.controller";
import { AddressRepository } from "src/infrastructure/repositories/address.repository";
import { CreateAddressUsecase } from "src/use-cases/addresses/create-address.use-case";
import { FetchUserAddressesUsecase } from "src/use-cases/addresses/fetch-user-addresses.use-case";

@Module({
    controllers: [AddressController],
    providers: [
        AddressRepository,
        {
            provide: CreateAddressUsecase,
            useFactory: (
                addressRepository: AddressRepository
            ) => new CreateAddressUsecase(addressRepository),
            inject: [AddressRepository]
        },
        {
            provide: FetchUserAddressesUsecase,
            useFactory: (
                addressRepository: AddressRepository
            ) => new FetchUserAddressesUsecase(addressRepository),
            inject: [AddressRepository]
        }
    ]
})

export class AddressModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes('/addresses');
    }   
}