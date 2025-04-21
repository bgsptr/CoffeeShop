import { Inject } from "@nestjs/common";
import { Category, Item, Prisma } from "@prisma/client";
import { CreateItemDto } from "src/core/domain/interfaces/dtos/items/create-item.dto";
import { ItemCategory, ItemStatus } from "src/core/domain/interfaces/types/enum.type";
import { ItemRepository } from "src/infrastructure/repositories/item.repository";

export class CreateItemUsecase {
    constructor(
        private itemRepository : ItemRepository,
        @Inject("DECIMAL_FACTORY") private readonly decimalFactory: (value: number | string) => Prisma.Decimal
    ) {}

    async execute(itemDto: CreateItemDto) {
        const category: Category | undefined = Object.values(Category).includes(itemDto.category as Category) ? (itemDto.category as Category) : undefined;
        const parsedStockToNum = parseInt(itemDto.stock, 10);
        const item: Partial<Item> = {
            name: itemDto.name,
            price: this.decimalFactory(itemDto.price),
            category: category,
            description: itemDto.description,
            stock: parsedStockToNum,
            image: itemDto.image,
            status: parsedStockToNum > 0 ? ItemStatus.AVAILABLE : ItemStatus.OUT_OF_STOCK
        }
        try {
            console.log("success post item")
            return await this.itemRepository.create(item)
        } catch(err) {
            console.log("kn: ", err)
        }
    }
}