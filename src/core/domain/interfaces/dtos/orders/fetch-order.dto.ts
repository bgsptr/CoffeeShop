import { Item } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class FetchOrderDto {
    constructor(
        public orderId: number,
        public items: Partial<Item>[],
        public totalPrice: Decimal
    ) {}
}