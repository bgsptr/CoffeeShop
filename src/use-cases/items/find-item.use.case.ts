import { ItemRepository } from "src/infrastructure/repositories/item.repository";

export class FindItemUsecase {
    constructor(
        private itemRepository: ItemRepository
    ) {}

    async execute(itemId: string) {
        const itemIdNumber: number = parseInt(itemId, 10);
        try {
            return await this.itemRepository.findItemById(itemIdNumber);
        } catch (err) {
            
        }
    }
}