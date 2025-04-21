import { $Enums, Order } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Repository } from "src/core/base/repository";

export interface IOrderRepository extends Repository<Order> {
    findOrderById(orderId: string): Promise<Order | null>;
}