import { OrderRepository } from "src/infrastructure/repositories/order.repository";

export class DeleteCartUsecase {
    constructor(
        private orderRepository: OrderRepository
    ) {}

    async execute(orderId: string) {
        try {
            await this.orderRepository.deleteById(orderId)
        } catch(err) {
            throw new Error(err)
        }
    }
}