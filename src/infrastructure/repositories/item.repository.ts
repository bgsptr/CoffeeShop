import { IItemRepository } from "src/core/domain/interfaces/repositories/item.repository.interface";
import { BaseRepository } from "./base.repository";
import { Category, Item } from "@prisma/client";

export class ItemRepository extends BaseRepository implements IItemRepository {
    async create(data: Partial<Item>): Promise<number> {
        const { id, ...rest } = await this.prisma.item.create({
            data: {
                name: data.name as string,
                description: data.description,
                price: data.price ?? 0,
                category: data.category ?? Category.COFFEE,
                image: data.image ?? "",
                stock: data.stock,
                status: data.status
            }
        });

        return id;
    }

    async getAllItem(): Promise<Item[]> {
        return await this.prisma.item.findMany();
    }

    async findItemById(itemId: number): Promise<Item> {
        return await this.prisma.item.findFirstOrThrow({
            where: {
                id: itemId
            }
        })
    }

    async findItemByIdNotReturnErr(itemId: number): Promise<Item | null> {
        return await this.prisma.item.findFirst({
            where: {
                id: itemId
            }
        }) ?? null
    }

    async getItemsDetail(itemIds: number[]): Promise<Item[]> {
        return await this.prisma.item.findMany({
            where: {
                id: {
                    in: itemIds
                }
            }
        })
    }
}