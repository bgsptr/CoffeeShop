import { PaymentStatus, PaymentType } from "@prisma/client";

export class PaymentDto {
    constructor(
        public orderId: string,
        public amount: number,
        public paymentType: string,
        public onlineMethod?: string
        // public paymentStatus: PaymentStatus
    ) {}
}