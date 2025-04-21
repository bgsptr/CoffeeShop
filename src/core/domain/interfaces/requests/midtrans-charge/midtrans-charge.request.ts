import { ChargeMidtransPaymentType, QrisAcquirerType } from "../../types/enum.type";


export interface TransactionDetail {
    order_id: string;
    gross_amount: number;
}

export interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
}

export interface CustomerDetail {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
}

export interface IMidtransChargeRequest {
    // payment_type: ChargeMidtransPaymentType
    transaction_details: TransactionDetail
    item_details: Partial<ItemDetail>[]
    customer_details: CustomerDetail
    qris?: {
      acquirer: QrisAcquirerType
    }
}

export class MidtransChargeRequest implements IMidtransChargeRequest {
    // payment_type: ChargeMidtransPaymentType;
    transaction_details: TransactionDetail;
    item_details: Partial<ItemDetail>[];
    customer_details: CustomerDetail;
    qris?: { acquirer: QrisAcquirerType };
  
    constructor(payload: IMidtransChargeRequest) {
    //   this.payment_type = payload.payment_type;
      this.transaction_details = payload.transaction_details;
      this.item_details = payload.item_details;
      this.customer_details = payload.customer_details;
      if (payload.qris) {
        this.qris = payload.qris;
      }
    }
}