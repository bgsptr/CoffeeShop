import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { OrderStatus, Role } from "@prisma/client";
import { Response } from "express";
import { FindEmail, FindUserId } from "src/core/domain/decorators/get-user-email.decorator";
import { Roles } from "src/core/domain/decorators/roles.decorator";
import { ForbiddenError } from "src/core/domain/errors/forbidden.error";
import { CustomNotFoundError } from "src/core/domain/errors/not-found.error";
import { RolesGuard } from "src/core/domain/guards/role.guard";
import { CreateOrderDto } from "src/core/domain/interfaces/dtos/orders/create-order.dto";
import { ApiResponse } from "src/core/domain/interfaces/dtos/responses/api-response.dto";
import { CleanOrderItemUsecase } from "src/use-cases/order/clean-order-item.use-case";
import { DeleteCartUsecase } from "src/use-cases/order/delete-cart.use-case";
import { FetchAllOrderUsecase } from "src/use-cases/order/fetch-all-order.use-case";
import { FindOrderUsecase } from "src/use-cases/order/find-order.use-case";
import { GetItemsInFirstOrderUsecase } from "src/use-cases/order/get-items-in-first-order.use-case";
import { GetItemsParamOrderUsecase } from "src/use-cases/order/get-items-param-order.use-case";
import { NewOrderUsecase } from "src/use-cases/order/new-order.use-case";
import { UpdateCartItemUsecase } from "src/use-cases/order/update-cart-item.use-case";
import { OrderDashboardAdminUsecase } from "src/use-cases/payments/admins/order-dashboard.use-case";

@UseGuards(RolesGuard)
@Controller("orders")
export class OrderController {
    constructor(
        private readonly findOrderUsecase: FindOrderUsecase,
        private readonly newOrderUsecase: NewOrderUsecase,
        private readonly cleanOrderItemUsecase : CleanOrderItemUsecase,
        private readonly getItemsInFirstOrderUsecase : GetItemsInFirstOrderUsecase,
        private readonly orderDashboardAdminUsecase: OrderDashboardAdminUsecase,
        private readonly getItemsParamOrderUsecase: GetItemsParamOrderUsecase,
        private readonly fetchAllOrderUsecase: FetchAllOrderUsecase
    ) {}

    @Get(":id")
    async getOrderById(@Param() params: { id: string }, @Res() res: Response, @FindUserId() userId: string) {
        try {
            const selectedOrderDto = await this.findOrderUsecase.execute(params.id, userId);

            const response = new ApiResponse(res, HttpStatus.OK, `order with id: ${params.id} fetched successfully`, selectedOrderDto);
            return response.send();
        } catch(err) {
            // console.log("err in getOrderById controller ", err.message)
            // console.log("should return true: ", err instanceof NotFoundError)
            if (err instanceof CustomNotFoundError) {
                throw new NotFoundException(err?.message);
            }
            else if (err instanceof ForbiddenError) {
                throw new ForbiddenException(err?.message);
            }
            throw err;
        }
    }

    // Order
    @Delete(":order_id")
    async deleteItemInCart(@Res() res: Response, @Param() params: { order_id: string }) {
        const isDeleted = await this.cleanOrderItemUsecase.execute(params.order_id);
        if (!isDeleted) throw new NotFoundException(`can't find the ordered item with ${params.order_id}`);

        const response = new ApiResponse(res, HttpStatus.OK, `item in order with id: ${params.order_id} deleted successfully`);
        return response.send();
    }

    @Post()
    // @Roles([Role.CUSTOMER])
    async createNewOrderController(@Res() res: Response, @Body() orderDto: CreateOrderDto, @FindEmail() email: string) {
        try {
            const { orderId, itemId } = await this.newOrderUsecase.execute(orderDto, email);

            const successMessageRes = !orderDto?.orderId ? `order with id: ${orderId} created successfully` : `added item with id ${itemId} to order with id: ${orderId}`
            const response = new ApiResponse(res, HttpStatus.OK, successMessageRes);
            return response.send();
        } catch (err) {
            const data = JSON.parse(err?.message);
            throw new HttpException({
                error: true,
                message: data?.message
            }, data?.statusCode, {
                cause: err
            })
        }
    }

    @Get("first/orderItems")
    async findFirstOrder(@Res() res: Response, @FindUserId() userId: string) {
        try {
            const orderItems = await this.getItemsInFirstOrderUsecase.execute(userId);
            const response = new ApiResponse(res, 200, `success fetch order or cart belonging to user with id ${userId}`, orderItems);
            return response.send();
        } catch(err) {
            if (err instanceof CustomNotFoundError) {
                throw new NotFoundException(err.message);
            }
            throw err;
        }
    }

    @Get(":order_id/orderItems")
    async findOrderWithId(@Res() res: Response, @Param("order_id") order_id: string ) {
        try {
            const orderItems = await this.getItemsParamOrderUsecase.execute(order_id);
            const response = new ApiResponse(res, 200, `success fetch order or cart with id ${order_id}`, orderItems);
            return response.send();
        } catch(err) {
            if (err instanceof CustomNotFoundError) {
                throw new NotFoundException(err.message);
            }
            throw err;
        }
    }

    @Get(":id/orderItems")
    async fetchAllOrderItems(@Res() res: Response, @Param() params: { id: string }) {

    }

    @Get("list")
    async fetchListShippingOrder(@Query("status") status: OrderStatus) {
        await this.orderDashboardAdminUsecase.execute(status);
    }

    @Get("users/me")
    async allOrder(@Res() res: Response, @FindUserId() userId: string) {
        try {
            const orders = await this.fetchAllOrderUsecase.execute(userId);
            const response = new ApiResponse(res, 200, `success all order from user with id ${userId}`, orders);
            return response.send();
        } catch(err) {
            throw err;
        }
    }
}