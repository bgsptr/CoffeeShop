import { Item } from "@prisma/client";
import { FetchItemQuery } from "src/core/domain/interfaces/types/enum.type";
import { ItemRepository } from "src/infrastructure/repositories/item.repository";

export class FetchItemsUsecase {
    constructor(
        private itemRepository: ItemRepository
    ) {}

    async execute(query: FetchItemQuery) {
        try {
            const items = await this.itemRepository.getAllItem();
            const filteredItemByType: Item[] = query.type ? items?.filter(item => item.category.toLowerCase() === query.type) : items;

            const filteredItemBySearch: Item[] = query.keyword ? filteredItemByType?.filter((item: Item) => {
                return item.name?.indexOf(query.keyword) !== -1;
            }) : filteredItemByType;
    
            return filteredItemBySearch;

        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }
}