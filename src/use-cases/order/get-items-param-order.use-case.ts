import { CustomNotFoundError } from "src/core/domain/errors/not-found.error";
import { OrderItemRepository } from "src/infrastructure/repositories/order-item.repository";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";

export class GetItemsParamOrderUsecase {
    constructor(
        private orderRepository: OrderRepository,
        private orderItemRepository: OrderItemRepository
    ) {}

    async execute(orderId: string) {
        // const parsedUserId = parseInt(userId, 10);
        const order = await this.orderRepository.findOrderById(orderId);

        if (!order) throw new CustomNotFoundError(`can't find order with id ${orderId}`);

        const stringOrderId = order.id.toString();
        const orderItems = await this.orderItemRepository.findAllByOrderId(stringOrderId) ?? [];

        return {
            orderId: stringOrderId,
            orderItemsId: orderItems.map(orderItem => orderItem.itemId)
        }
    }
}