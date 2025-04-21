import { PaymentStatus } from "@prisma/client";
import { ChargeMidtransPaymentType } from "../../types/enum.type";

export interface OrderDetails {
    itemId: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
}

export interface QrisPaymentDetail {
    transactionId: string;
    paymentExpiryAt: string;
    paymentCreatedAt: string;
    transactionStatus: PaymentStatus;
    url: string;
    qrString: string;
}

export interface PaymentQrisDto {
    paymentId: string;
    orderId: number;
    orderDetails: OrderDetails[];
    amount: number;
    paymentMethod: ChargeMidtransPaymentType | 'cash';
    paymentDetail?: QrisPaymentDetail;
    // addressId: string;
    // fullAddress: string;
}
