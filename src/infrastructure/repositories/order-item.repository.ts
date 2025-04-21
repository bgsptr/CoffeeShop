import { IOrderItemRepository } from 'src/core/domain/interfaces/repositories/order-item.repository.interface';
import { BaseRepository } from './base.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderItem } from '@prisma/client';
import { ForbiddenError } from 'src/core/domain/errors/forbidden.error';

export class OrderItemRepository
  extends BaseRepository
  implements IOrderItemRepository
{
  async create(data: {
    orderId: number;
    itemId: number;
    quantity: number;
    subtotal: Decimal;
  }, orderIdIsExist?: boolean): Promise<{ orderId: number, itemId: number | null }> {
    const { orderId, itemId } = await this.prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        itemId: data.itemId,
        quantity: data.quantity,
        subtotal: data.subtotal,
      },
    });

    return {
      orderId,
      itemId: orderIdIsExist ? itemId : null
    };
  }

  async updateById(
    id: number | string,
    data: Partial<OrderItem>
  ): Promise<any | void> {
    await this.prisma.orderItem.update({
      data: {
        // id: data.id,
        // orderId: data.orderId,
        // itemId: data.itemId,
        quantity: data.quantity,
        subtotal: data.subtotal,
      },
      where: {
        id: Number(id),
      },
    });
  }

  async deleteById(id: number | string, userOrderIds: number[]): Promise<void> {
    await this.prisma.orderItem.delete({
      where: {
        id: parseInt(String(id), 10),
      },
    });
  }

  async findAllByOrderId(orderId: string): Promise<OrderItem[]> {
    return await this.prisma.orderItem.findMany({
      where: {
        orderId: Number(orderId),
      },
    });
  }

  async findById(cartId: number): Promise<OrderItem> {
    return await this.prisma.orderItem.findFirstOrThrow({
      where: {
        id: cartId
      }
    })
  }

  async deleteAllItemInCart(orderId: string | number) {
    await this.prisma.orderItem.deleteMany({
      where: {
        orderId: Number(orderId)
      }
    })
  }

  async checkItemInOrderIsExist(orderId: number, itemId: number) {
    return await this.prisma.orderItem.findFirst({
      where: {
        AND: [
          { orderId: orderId },
          { itemId: itemId }
        ]
      }
    })
  }
}
