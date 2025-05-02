import { OrderRepository } from "src/infrastructure/repositories/order.repository";

export class FetchAllOrderUsecase {
    constructor(
        private readonly orderRepository: OrderRepository
    ) {}

    async execute(userId: string) {
        return await this.orderRepository.fetchAllOrderByUserIdWithStatusPending(Number(userId));
    }
}