export interface CreateOrderDto {
    itemId: string;
    quantity: number;
    orderId?: string;
}