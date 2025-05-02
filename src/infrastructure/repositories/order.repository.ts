import { IOrderRepository } from 'src/core/domain/interfaces/repositories/order.repository.interface';
import { BaseRepository } from './base.repository';
import { $Enums, Order, OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class OrderRepository
  extends BaseRepository
  implements IOrderRepository
{
  async create(data: { userId: number; totalPrice: Decimal }): Promise<number> {
    const { id, ...rest } = await this.prisma.order.create({
      data: {
        userId: data.userId,
        totalPrice: data.totalPrice,
      },
    });

    return id;
  }

  async updateById(
    id: number | string,
    data: { totalPrice?: Decimal; status?: $Enums.OrderStatus },
  ): Promise<any | void> {

    const updateData: { totalPrice?: Decimal; status?: $Enums.OrderStatus } = {
      status: data.status,
      totalPrice: data.totalPrice
    };
  
    // if (data.totalPrice !== undefined) {
    //   updateData.totalPrice = data.totalPrice;
    // }

    const { totalPrice, createdAt } = await this.prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        totalPrice: updateData.totalPrice,
        status: updateData.status,
      },
    });

    return {
      id,
      totalPrice,
      status: data.status,
      createdAt: createdAt,
    };
  }

  async deleteById(id: number | string): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async findOrderById(orderId: string): Promise<Order> {
    return await this.prisma.order.findFirstOrThrow({
      where: {
        id: Number(orderId),
      },
    });
  }

  async getFirstOrderByUserId(userId: number): Promise<Order | null> {
    return await this.prisma.order.findFirst({
      where: {
        userId,
      },
    });
  }

  async findManyByUserId(userId: number): Promise<number[]> {
    const datas = await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
    });

    return datas.map((data) => data.id);
  }

  async fetchAllOrderByUserId(userId: number) {
    return await this.prisma.order.findMany({
      where: {
        userId
      }
    })
  }

  async fetchAllOrderByUserIdWithStatusPending(userId: number) {
    return await this.prisma.order.findMany({
      where: {
        userId,
        status: OrderStatus.PENDING
      }
    })
  }

  async getPendingOrdersWithShippingAndAddress() {
    const data = await this.prisma.order.findMany({
      select: {
        id: true, // orderId
        totalPrice: true,
        status: true,
        shipping: {
          select: {
            id: true, // shippingId
            shippedAt: true,
            arrivedAt: true,
            note: true,
            address: {
              select: {
                id: true, // addressId
                fullAddress: true,
                distance: true,
                estimatedTime: true,
                lat: true,
                lng: true,
              },
            },
          },
        },
      },
    });
  
    return data;
  }

    async rollbackStatusToPendingBatchJob(paymentIds: number[]) {
      await this.prisma.order.updateMany({
        where: {
          id: {
            in: paymentIds,
          },
        },
        data: {
          status: OrderStatus.PENDING,
        },
      });
    }
}
