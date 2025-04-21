import { Payment } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IPaymentRepository extends Repository<Payment> {
    create(data: Payment): Promise<string>;
    fetchPaymentFromAllCustomer(): Promise<Payment[]>;
    fetchPaymentOnlyCustomerById(userId: number): Promise<Payment[]>;
}