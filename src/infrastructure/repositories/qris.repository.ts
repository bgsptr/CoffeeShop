import { IQrisRepository } from 'src/core/domain/interfaces/repositories/qris.repository.interface';
import { BaseRepository } from './base.repository';
import { PaymentStatus, Qris } from '@prisma/client';

export class QrisRepository extends BaseRepository implements IQrisRepository {
  async create(data: Qris): Promise<Qris> {
    return await this.prisma.qris.create({
      data: {
        id: data.id,
        transactionTime: data.transactionTime,
        transactionStatus: data.transactionStatus,
        url: data.url,
        fraudStatus: data.fraudStatus,
        qrString: data.qrString,
        expiredAt: data.expiredAt,
        paymentId: data.paymentId,
      },
    });
  }

  async findQrisPaymentById(paymentId: string): Promise<Qris> {
    return await this.prisma.qris.findFirstOrThrow({
      where: {
        paymentId,
      },
    });
  }

  async updateStatusToPaidWithTransactionId(id: string): Promise<string> {
    const payment = await this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    return payment.id;
  }

  async checkExpiredQris(paymentIds: string[], curr: string) {
    const expired = await this.prisma.qris.findMany({
      where: {
        paymentId: {
          in: paymentIds,
        },
        expiredAt: {
          gt: curr,
        },
      },
    });

    return expired;
  }

  async updateStatusExpiredBatchJob(paymentIds: string[]) {
    await this.prisma.qris.updateMany({
      where: {
        paymentId: {
          in: paymentIds
        }
      },
      data: {
        transactionStatus: PaymentStatus.FAILED
      }
    })
  }
}
