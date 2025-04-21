import { ItemCategory } from "../../types/enum.type";

export class CreateItemDto {
    constructor(
        public name: string,
        public description: string,
        public price: string,
        public image: string,
        public category: ItemCategory,
        public stock: string
    ) {}
}