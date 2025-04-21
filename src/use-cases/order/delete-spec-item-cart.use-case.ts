import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenError } from 'src/core/domain/errors/forbidden.error';
import { CustomNotFoundError } from 'src/core/domain/errors/not-found.error';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';

export class DeleteSpecificItemInCart {
  constructor(
    private orderItemRepository: OrderItemRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(orderItemId: string, userId: string) {
    try {
      const groupsOfOrderId: number[] =
        await this.orderRepository.findManyByUserId(parseInt(userId, 10));
      const { orderId, subtotal } = await this.orderItemRepository.findById(
        parseInt(orderItemId, 10),
      );

      if (!groupsOfOrderId.includes(orderId))
        throw new ForbiddenError('forbidden, cannot delete such resource');

      await this.orderItemRepository.deleteById(orderItemId, groupsOfOrderId);

      console.log('order id: ', orderId);
      const { totalPrice } = await this.orderRepository.findOrderById(
        orderId.toString(),
      );
      await this.orderRepository.updateById(orderId, {
        totalPrice: totalPrice.sub(subtotal),
      });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        throw new CustomNotFoundError(
          `can't find orderitem with id ${orderItemId}`,
        );
      }
      throw new ForbiddenError(error?.message);
    }
  }
}
