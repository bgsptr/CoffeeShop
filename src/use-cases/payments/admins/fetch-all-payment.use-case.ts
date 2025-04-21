import { PaymentStatus, PaymentType } from "@prisma/client";
import { PaymentRepository } from "src/infrastructure/repositories/payment.repository";

export class FetchAllOrderPaymentUsecase {
    constructor(
        // public paymentId: string,
        // public orderId: number,
        // public userId: number,
        // public amount: number,
        // public paymentType : PaymentType,
        // public paymentStatus : PaymentStatus

        private readonly paymentRepository: PaymentRepository
    ) {}

    // relation
    // order - shipping: 1 - 1, shipping save orderId as FK
    // address - shipping: 1 - M, shipping save addressId as FK

//     SELECT
//   Shipping.id AS shippingId,
//   Shipping.shippedAt,
//   Shipping.arrivedAt,
//   Shipping.note,
//   `Order`.id AS orderId,
//   `Order`.totalPrice as totalPrice,
//   Address.id AS addressId,
//   Address.fullAddress,
//   Address.distance,
//   Address.estimatedTime
//   Address.lat
//   Address.lng
// FROM Shipping
// LEFT JOIN `Order` ON Shipping.orderId = `Order`.id
// LEFT JOIN Address ON Shipping.addressId = Address.id where Order.status='pending';


    async execute() {
        return await this.paymentRepository.fetchPaymentFromAllCustomer();
    }
}