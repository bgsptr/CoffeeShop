import { OrderItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Repository } from "src/core/base/repository";

export interface IOrderItemRepository extends Repository<OrderItem> {
    create(data: { id: number; orderId: number; itemId: number; quantity: number; subtotal: Decimal; }, ...args: any): Promise<any>;
    updateById(id: number | string, data: { id: number; orderId: number; itemId: number; quantity: number; subtotal: Decimal; }): Promise<any | void>;
    deleteById(id: number | string, userOrderIds: number[]): Promise<void>;
}