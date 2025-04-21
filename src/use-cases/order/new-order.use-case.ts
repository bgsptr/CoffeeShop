import { HttpStatus, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import e from 'express';
import { CreateOrderDto } from 'src/core/domain/interfaces/dtos/orders/create-order.dto';
import { ItemRepository } from 'src/infrastructure/repositories/item.repository';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';

export class NewOrderUsecase {
  constructor(
    private orderRepository: OrderRepository,
    private itemRepository: ItemRepository,
    private orderItemRepository: OrderItemRepository,
    private userRepository: UserRepository,
    @Inject('DECIMAL_FACTORY')
    private readonly decimalFactory: (value: number | string) => Prisma.Decimal,
  ) {}

  async execute(orderData: CreateOrderDto, email: string) {
    // const { id } = await this.userRepository.findByEmail(email);
    // const { itemId, quantity } = orderData;
    // const parsedItemId = parseInt(itemId, 10);
    // const {
    //     name,
    //     price,
    //     stock,
    //     category,
    //     status
    // } = await this.itemRepository.findItemById(parsedItemId);

    // const priceInt = quantity * parseFloat(String(price));
    // const totalPrice = this.decimalFactory(priceInt);

    // const orderId = !orderData.orderId ? await this.orderRepository.create({
    //     userId: id,
    //     totalPrice
    // }) : parseInt(orderData.orderId);

    // const itemIsAdded = await this.orderItemRepository.checkItemInOrderIsExist(orderId, parsedItemId);

    // if (itemIsAdded) throw new Error(`item with id ${parsedItemId} is already exist in order with id ${orderId}`)

    // const orderItemData = {
    //     orderId,
    //     itemId: parsedItemId,
    //     quantity,
    //     subtotal: totalPrice
    // }

    // return await this.orderItemRepository.create(orderItemData);

    const parsedItemId = parseInt(orderData.itemId, 10);

    const [user, item, existingOrder] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.itemRepository.findItemByIdNotReturnErr(parsedItemId),
      orderData.orderId
        ? this.orderRepository.findOrderById(orderData.orderId).catch(err => {
          // console.log(`error find order data: order with id ${orderData.orderId} is not exist`);
          throw new Error(
            JSON.stringify({
              statusCode: HttpStatus.NOT_FOUND,
              message: `error find order data: order with id ${orderData.orderId} is not exist`,
            }),
          );
        })
        : null,
    ]);

    if (!user)
      throw new Error(`Forbidden, can't find user with email ${email}`);
    if (!item)
      throw new Error(
        JSON.stringify({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Can't find item with id ${parsedItemId}`,
        }),
      );
    // if (!existingOrder)
    //   throw new Error(
    //     JSON.stringify({
    //       statusCode: HttpStatus.NOT_FOUND,
    //       message: `Can't find order with id ${orderData.orderId}`,
    //     }),
    //   );

    const { id: userId } = user;
    const { price } = item;

    const totalPrice = this.decimalFactory(
      orderData.quantity * parseFloat(String(price)),
    );

    const orderId = existingOrder
      ? existingOrder.id
      : await this.orderRepository.create({ userId, totalPrice });

    try {
      if (
        await this.orderItemRepository.checkItemInOrderIsExist(
          orderId,
          parsedItemId,
        )
      ) {
        throw new Error(
          JSON.stringify({
            statusCode: HttpStatus.CONFLICT,
            message: `Item with id ${parsedItemId} is already in order ${orderId}`,
          }),
        );
      }

      await this.orderRepository.updateById(orderId, {
        totalPrice: this.decimalFactory(
          totalPrice.toNumber() + (existingOrder?.totalPrice.toNumber() ?? 0),
        ),
      });

      return await this.orderItemRepository.create({
        orderId,
        itemId: parsedItemId,
        quantity: orderData.quantity,
        subtotal: totalPrice,
      }, orderData?.orderId !== null);

      
    } catch (err) {
      console.error('Error checking if item exists in order:', err);
      throw new Error(err?.message);
    }
  }
}
