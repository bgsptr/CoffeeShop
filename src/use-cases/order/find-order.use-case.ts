import { Item } from "@prisma/client";
import { CustomHTTPError } from "src/core/domain/errors/custom-http.error";
import { ForbiddenError } from "src/core/domain/errors/forbidden.error";
import { CustomNotFoundError } from "src/core/domain/errors/not-found.error";
import { FetchOrderMapper } from "src/core/domain/mappers/orders/fetch-order.mapper";
import { ItemRepository } from "src/infrastructure/repositories/item.repository";
import { OrderItemRepository } from "src/infrastructure/repositories/order-item.repository";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";

export class FindOrderUsecase {
    constructor(
        private orderRepository: OrderRepository,
        private itemRepository: ItemRepository,
        private orderItemRepository: OrderItemRepository,
        private fetchOrderMapper: FetchOrderMapper,
    ) {}

    async execute(orderId: string, userIdFromToken: string) {
        console.log("execute cart with id: ", orderId);
        console.log("current login status, user with id : ", userIdFromToken);

        try {
            const { id, totalPrice, userId, ...rest } = await this.orderRepository.findOrderById(orderId)
            .catch(() => {
                throw new CustomNotFoundError(`Can't find order with id ${orderId}`)
            });

            const isUsersCartMatch = userId !== parseInt(userIdFromToken, 10); 

            console.log("check id match or not with user id, status: ", isUsersCartMatch)

            if (isUsersCartMatch) throw new ForbiddenError(`Current user is not prohobited to access such resource`)
            
            const itemsOrdered = await this.orderItemRepository.findAllByOrderId(orderId) ?? [];
            console.log(itemsOrdered)
            const itemsId: number[] = itemsOrdered.map(item => item.itemId);
            console.log(itemsId)
            
            const items: Item[] = itemsOrdered.length !== 0 ? await this.itemRepository.getItemsDetail(itemsId) : [];

            const itemMap = new Map(itemsOrdered.map(item => [item.itemId, item]))

            console.log(itemMap);
            const newItem = items.map((data: Item) => {
                const orderedItem = itemMap.get(data.id)
                return {
                    image: data.image,
                    id: orderedItem?.id,
                    name: data.name,
                    description: data.description,
                    subtotal: orderedItem?.subtotal,
                    quantity: orderedItem?.quantity
                }
            })
    
            return this.fetchOrderMapper.mapFromEntity(id, newItem, totalPrice);
            
        } catch(err) {
            console.log("error not found: ", err.message)
            if (err instanceof CustomHTTPError) {
                throw err;
            }
            throw new CustomHTTPError("An unexpected error occurred");
        }

    }
}