import { midtrans } from 'src/core/contants/variable';
import { v4 as uuidv4 } from 'uuid';

export class QrisPaymentUsecase {
  constructor() {}

  async execute() {
    const midtransTransactionUrl = `${midtrans.baseUrl}/snap/v1/transactions`;
    const base64MidtransServerKey = Buffer.from(
      midtrans.serverKey + ':',
    ).toString('base64');
    try {
      const requestBody = {
        payment_type: 'qris',
        transaction_details: {
          order_id: 'order_id-0123',
          gross_amount: 100000,
        },
        qris: {
          acquirer: 'gopay',
        },
      };

      //   await

      const response = await fetch(midtransTransactionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${base64MidtransServerKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);
      console.log('payment success');
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
