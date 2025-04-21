import { PaymentRepository } from 'src/infrastructure/repositories/payment.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { OrderDetailUsecase } from '../order/order-detail-service/order-detail.use-case';
import {
  PaymentQrisDto,
  QrisPaymentDetail,
} from 'src/core/domain/interfaces/dtos/payments/payment-qris.dto';
import { TimeUtil } from 'src/utils/time.util';

// export interface PaymentQrisJoinEntity {
//   id: string;
//     orderId: number;
//     amount: Decimal;
//     qris: {
//         id: string;
//         transactionTime: Date;
//         transactionStatus: $Enums.PaymentStatus;
//         url: string;
//         qrString: string;
//         expiredAt: Date;
//     } | null;
// }

export class PaymentListUsecase {
  constructor(
    private paymentRepository: PaymentRepository,
    private userRepository: UserRepository,
    private orderDetailUsecase: OrderDetailUsecase,
  ) {}

  async execute(email: string) {
    const { id: userId } = await this.userRepository.findByEmail(email);
    const paymentdatas = await this.paymentRepository.paymentQrisAndCash(userId);
    // const paymentdatasCash = await this.paymentRepository.paymentNonQris(userId);

    // console.log("lah kok bisa: ", [...paymentdatas, ...paymentdatasCash])

    // paymentdatasCash.map((prev) => ({
    //   ...prev,
    //   qris: null
    // }));

    // console.log(paymentdatas);

    // const orderDetails = await this.orderDetailUsecase.getOrderDetail(orderId.toString());

    const qrisPaymentDto: PaymentQrisDto[] = [];

    for (const data of paymentdatas) {
      const orderDetail = await this.orderDetailUsecase.getOrderDetail(data.orderId.toString());

      const paymentDto: PaymentQrisDto = {
        orderId: Number(data.orderId),
        paymentId: data.id,
        amount: data.amount.toNumber(),
        paymentMethod: data.qris ? 'qris' : 'cash',
        orderDetails: orderDetail,
        ...(data.qris && {
          paymentDetail: {
            transactionId: data.qris.id,
            paymentCreatedAt: TimeUtil.parseTimeToStringDayJS(data.qris.transactionTime),
            transactionStatus: data.qris.transactionStatus,
            url: data.qris.url,
            qrString: data.qris.qrString,
            paymentExpiryAt: TimeUtil.parseTimeToStringDayJS(data.qris.expiredAt),
          },
        }),
      };

      qrisPaymentDto.push(paymentDto);
    }

    console.log(qrisPaymentDto);

    return qrisPaymentDto;
  }
}
