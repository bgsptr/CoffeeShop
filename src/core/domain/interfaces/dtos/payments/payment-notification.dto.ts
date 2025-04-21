export interface MidtransPaymentNotificationDto {
    transaction_status: string;
    transaction_id: string;
    payment_type: string;
    gross_amount: string;
    order_id: string;
    fraud_status: string;
}