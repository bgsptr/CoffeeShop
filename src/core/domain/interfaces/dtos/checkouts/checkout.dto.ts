import { OrderItem, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class CheckoutDto {
    constructor(
        public order_id: string,
        public cart_items: Partial<OrderItem>[],
        public total_price: Decimal,
        public shipping_address?: string,
        public distance?: number,
        public lat?: string,
        public lng?: string,
        public user_id?: string,
        // public lastActivity: number 
    ) {}
}