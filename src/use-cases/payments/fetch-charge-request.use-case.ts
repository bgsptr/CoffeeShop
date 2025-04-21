import { midtrans } from 'src/core/contants/variable';
import { PaymentDto } from 'src/core/domain/interfaces/dtos/payments/payment.dto';
import {
  ItemDetail,
  MidtransChargeRequest,
} from 'src/core/domain/interfaces/requests/midtrans-charge/midtrans-charge.request';
import { ItemRepository } from 'src/infrastructure/repositories/item.repository';
import { OrderItemRepository } from 'src/infrastructure/repositories/order-item.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { v1 as uuidv1 } from 'uuid';

export class FetchChargeRequestUsecase {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly itemRepository: ItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    paymentDto: PaymentDto,
    email: string,
    paymentId: string,
    amount: number,
  ): Promise<MidtransChargeRequest> {
    // find the item_details
    const ordersItem = await this.orderItemRepository.findAllByOrderId(
      paymentDto.orderId,
    );

    const itemDetailList: Partial<ItemDetail>[] = [];
    // const itemIds: number[] = [];

    // const shippingTotal = ordersItem.reduce((total, order) => {
    //   itemIds.push(order.orderId);
    //   itemDetailList.push({
    //     id: order.itemId.toString(),
    //     quantity: order.quantity,
    //   });

    //   return total + order.subtotal.toNumber();
    // }, 0);

    let shippingPrice = 0;

    const itemIds = ordersItem.map((order) => {
      shippingPrice += order.subtotal.toNumber();
      itemDetailList.push({
        id: order.itemId.toString(),
        quantity: order.quantity,
      });
      return order.itemId;
    });

    const customerDetail = await this.userRepository.findByEmail(email);
    const itemsGroup = await this.itemRepository.getItemsDetail(itemIds);

    const updatedItemDetailGroup = itemDetailList.map((itemDetail) => {

      // bug
      const foundItem = itemsGroup.find(
        (item) => item.id.toString() === itemDetail.id,
      );

      console.log(foundItem);

      return {
        ...itemDetail,
        price: Number(foundItem?.price),
        name: foundItem?.name,
      } as ItemDetail;
    });

    console.log(updatedItemDetailGroup);

    updatedItemDetailGroup.push({
      id: paymentId,
      price: amount - shippingPrice,
      name: `shipping-with-paymentid-${paymentId}`,
      quantity: 1,
    });

    const { name, phone } = customerDetail;

    return new MidtransChargeRequest({
      item_details: updatedItemDetailGroup,
      transaction_details: {
        order_id: paymentDto.orderId,
        gross_amount: paymentDto.amount,
      },
      customer_details: {
        email,
        first_name: name,
        phone: phone ?? '',
      },
    });
  }
}
