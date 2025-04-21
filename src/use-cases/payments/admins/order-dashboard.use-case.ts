import { OrderStatus } from "@prisma/client";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";

export class OrderDashboardAdminUsecase {
    constructor(
        private readonly orderRepository: OrderRepository
    ) {}

    async execute(orderStatus: OrderStatus) {
        try {
            const orders = await this.orderRepository.getPendingOrdersWithShippingAndAddress();

            return orders.filter((val) => val.status === orderStatus)
        } catch(err) {
            throw err;
        }
    }
}