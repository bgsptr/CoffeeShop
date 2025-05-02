import { OrderStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequest } from 'src/core/domain/errors/bad-request.error';
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

      const { totalPrice, status } = await this.orderRepository.findOrderById(
        orderId.toString(),
      );

      if (status !== OrderStatus.PENDING) throw new BadRequest(`order with id ${orderId} already checkout`)


      if (!groupsOfOrderId.includes(orderId))
        throw new ForbiddenError('forbidden, cannot delete such resource');

      await this.orderItemRepository.deleteById(orderItemId, groupsOfOrderId);

      console.log('order id: ', orderId);

      // check if item in order only one then error
      const itemRemaining = await this.orderItemRepository.countItemInCart(
        Number(orderId),
      );

      console.log("items total: ", itemRemaining)

      if (itemRemaining === 1) {
        await this.orderItemRepository.deleteAllItemInCart(orderId);
        await this.orderRepository.deleteById(orderId);
      } else {
        await this.orderRepository.updateById(orderId, {
          totalPrice: totalPrice.sub(subtotal),
        });
      }

      return itemRemaining;
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
