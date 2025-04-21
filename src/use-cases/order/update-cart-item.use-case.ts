import { HttpStatus, Inject } from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';

export class UpdateCartItemUsecase {
  constructor(
    private orderItemRepository: OrderItemRepository,
    private orderRepository: OrderRepository,
    @Inject('DECIMAL_FACTORY')
    private readonly decimalFactory: (value: number | string) => Prisma.Decimal,
  ) {}

  async execute(cartId: string, quantity: number) {
    const parsedCartId = parseInt(cartId, 10);

    try {
      const cart = await this.orderItemRepository.findById(parsedCartId)
      .catch(() => {
        throw new Error(
            JSON.stringify({
              statusCode: HttpStatus.NOT_FOUND,
              message: `can't find orderitem object with id ${parsedCartId}`,
            }),
          );
      });
      const priceBase = parseFloat(String(cart?.subtotal)) / cart.quantity;

      const itemInCartData: Partial<OrderItem> = {
        id: parsedCartId,
        quantity,
        subtotal: this.decimalFactory(priceBase * quantity),
      };

      await this.orderItemRepository.updateById(cart.id, itemInCartData);

      console.log(cart.orderId);

      this.orderRepository
        .findOrderById(String(cart.orderId))
        .then((order) => {
          if (!order)
            throw new Error(
              JSON.stringify({
                statusCode: HttpStatus.NOT_FOUND,
                message: `Can't find order with id ${cart.orderId}`,
              }),
            );

          return order;
        })
        .then(async (data) => {
          if (itemInCartData.subtotal) {
            const basePriceOrder = data.totalPrice.sub(cart.subtotal);
            await this.orderRepository.updateById(cart.orderId, {
                totalPrice: basePriceOrder.add(itemInCartData.subtotal),
              });
          }

        })
        .catch((err) => {
          throw new Error(
            JSON.stringify({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: `internal server error, error: ${err?.message}`,
            }),
          );
        });

    } catch (error) {
      console.log(error);
      throw new Error(error?.message);
    }
  }
}
