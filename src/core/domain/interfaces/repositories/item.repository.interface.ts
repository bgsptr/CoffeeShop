import { Item } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IItemRepository extends Repository<Item> {
    getAllItem(): Promise<Item[] | null>;
    findItemById(itemId: number): Promise<Item>;
}