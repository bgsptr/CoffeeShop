import { PaymentRepository } from "src/infrastructure/repositories/payment.repository";

export class DashboardPaymentUsecase {
    constructor(
        private readonly paymentRepository: PaymentRepository
    ) {}

    async execute() {
        return this.paymentRepository.orderAdminDashboard();
    }
}