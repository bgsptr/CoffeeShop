import { Qris } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IQrisRepository extends Repository<Qris> {
    create(data: Qris): Promise<Qris>;
    findQrisPaymentById(paymentId: string): Promise<Qris>;
}