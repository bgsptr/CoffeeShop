import { OrderItemRepository } from "src/infrastructure/repositories/order-item.repository";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";

export class CleanOrderItemUsecase {
    constructor(
        private orderItemRepository: OrderItemRepository,
        private orderRepository: OrderRepository
    ) {}

    async execute(orderId: string): Promise<boolean> {
        await this.orderItemRepository.deleteAllItemInCart(orderId);

        try {
            const itemId = await this.orderItemRepository.findById(parseInt(orderId, 10));
            if (!itemId) {
                await this.orderRepository.deleteById(orderId);
                return true;
            }
            return false;
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}