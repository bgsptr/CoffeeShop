import { OrderDetails } from 'src/core/domain/interfaces/dtos/payments/payment-qris.dto';
import { ItemRepository } from 'src/infrastructure/repositories/item.repository';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';

export class OrderDetailUsecase {
  constructor(
    private readonly orderItemRepo: OrderItemRepository,
    private readonly itemRepo: ItemRepository,
  ) {}

  async getOrderDetail(orderId: string): Promise<OrderDetails[]> {
    const ordersItem = await this.orderItemRepo.findAllByOrderId(orderId);
    const itemIds = ordersItem.map((order) => order.itemId);
    const items = await this.itemRepo.getItemsDetail(itemIds);

    return ordersItem.map((order) => {
      const matchedItem = items.find((item) => item.id === order.itemId);

      return {
        itemId: matchedItem?.id ?? 0,
        name: matchedItem?.name ?? '',
        quantity: order.quantity,
        price: Number(matchedItem?.price ?? 0),
        imageUrl: matchedItem?.image ?? '',
      };
    });
  }
}
