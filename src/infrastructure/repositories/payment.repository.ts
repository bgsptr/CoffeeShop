import { IPaymentRepository } from 'src/core/domain/interfaces/repositories/payment.repository.interface';
import { BaseRepository } from './base.repository';
import {
  $Enums,
  Payment,
  PaymentStatus,
  PaymentType,
  Prisma,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export type PaymentWithEmail = Payment & {
  user: {
    email: string;
  };
};

export class PaymentRepository
  extends BaseRepository
  implements IPaymentRepository
{
  async create(data: Payment): Promise<string> {
    const { id } = await this.prisma.payment.create({
      data: {
        id: data.id,
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        paymentType: data.paymentType,
        paymentStatus: data.paymentStatus,
      },
    });

    return id;
  }

  async fetchPaymentFromAllCustomer(): Promise<PaymentWithEmail[]> {
    return await this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async fetchPaymentOnlyCustomerById(userId: number): Promise<Payment[]> {
    return await this.prisma.payment.findMany({
      where: {
        userId,
      },
    });
  }

  async paymentQrisAndCash(userId: number) {
    return await this.prisma.payment.findMany({
      where: {
        userId,
        qris: {
          NOT: undefined,
        },
      },
      select: {
        id: true,
        orderId: true,
        amount: true,
        qris: {
          select: {
            id: true,
            transactionTime: true,
            transactionStatus: true,
            url: true,
            qrString: true,
            expiredAt: true,
          },
        },
      },
    });
  }

  // async paymentNonQris(userId: number) {
  //   return await this.prisma.payment.findMany({
  //     where: {
  //       userId,
  //       qris: null
  //     },
  //     select: {
  //       id: true,
  //       orderId: true,
  //       amount: true,
  //       qris: true
  //     }
  //   })
  // }

  async updateById(
    id: string,
    data?: {
      id: string;
      orderId: number;
      userId: number;
      amount: Decimal;
      paymentType: $Enums.PaymentType;
      paymentStatus: $Enums.PaymentStatus;
      transactionDate: Date;
    },
  ): Promise<any | void> {
    const { paymentStatus, ...restData } = data!;
    await this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        ...restData,
        paymentStatus: !data ? PaymentStatus.PAID : PaymentStatus.PENDING,
      },
    });
  }

  async updateStatusToPaidByOrderId(paymentId: string) {
    await this.prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  }

  async checkCashPaymentByOrderId(orderId: number) {
    return (
      (await this.prisma.payment.findFirst({
        where: {
          AND: {
            orderId,
            paymentType: PaymentType.CASH,
          },
        },
      })) || null
    );
  }

  async fetchAllPaymentsByOrderId(orderId: number) {
    return await this.prisma.payment.findMany({
      where: {
        orderId,
      },
    });
  }

  async orderAdminDashboard() {
    return await this.prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        paymentType: true,
        transactionDate: true,
        order: {
          select: {
            id: true,
            totalPrice: true,
          },
        },
        user: {
          select: {
            addresses: {
              select: {
                id: true,
                fullAddress: true,
                postalCode: true,
                estimatedTime: true,
                distance: true,
                lat: true,
                lng: true,
              },
            },
          },
        },
      },
      where: {
        OR: [
          {
            paymentType: PaymentType.CASH,
          },
          {
            paymentType: PaymentType.ONLINE,
            paymentStatus: PaymentStatus.PAID,
          },
        ],
      },
    });
  }

  async updateStatusBatchJob(paymentIds: string[]) {
    await this.prisma.payment.updateMany({
      where: {
        id: {
          in: paymentIds,
        },
      },
      data: {
        paymentStatus: PaymentStatus.FAILED,
      },
    });
  }
}
