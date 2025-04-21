import { BadRequestException, Body, Controller, Delete, ForbiddenException, HttpException, HttpStatus, NotFoundException, Param, Patch, Res, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Response } from "express";
import { FindUserId } from "src/core/domain/decorators/get-user-email.decorator";
import { Roles } from "src/core/domain/decorators/roles.decorator";
import { ForbiddenError } from "src/core/domain/errors/forbidden.error";
import { CustomNotFoundError } from "src/core/domain/errors/not-found.error";
import { RolesGuard } from "src/core/domain/guards/role.guard";
import { ApiResponse } from "src/core/domain/interfaces/dtos/responses/api-response.dto";
import { DeleteSpecificItemInCart } from "src/use-cases/order/delete-spec-item-cart.use-case";
import { UpdateCartItemUsecase } from "src/use-cases/order/update-cart-item.use-case";

@UseGuards(RolesGuard)
@Controller("order_items")
export class OrderItemController {
    constructor(
        private readonly updateCartItemUsecase : UpdateCartItemUsecase,
        private deleteSpecificItemInCart : DeleteSpecificItemInCart
    ) {}

    @Patch(":order_item_id")
    @Roles([Role.CUSTOMER, Role.ADMIN])
    async updateItemInCart(@Res() res: Response, @Param() params: { order_item_id: string }, @Body("quantity") quantity: number) {
        if (!params || typeof params.order_item_id !== "string") throw new BadRequestException("order_item_id is required");
        if (typeof quantity !== "number") throw new BadRequestException("quantity must be a number");
        if (quantity < 0) throw new BadRequestException("quantity must have positive value or above than 0");

        try {
            await this.updateCartItemUsecase.execute(params.order_item_id, quantity);
            const response = new ApiResponse(res, HttpStatus.OK, `orderitem with id: ${params.order_item_id} updated successfully`);
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

    @Delete(":order_item_id")
    async deleteOrder(@Res() res: Response, @Param() params: { order_item_id: string }, @FindUserId() userId: string) {

        if (!params.order_item_id) return new NotFoundException(`can't find orderitem with id ${params.order_item_id}`);

        try {
            await this.deleteSpecificItemInCart.execute(params.order_item_id, userId);
            const response = new ApiResponse(res, HttpStatus.OK, `order with id: ${params.order_item_id} deleted successfully`);
            return response.send();
        } catch(err) {
            if (err instanceof ForbiddenError) {
                throw new ForbiddenException(err?.message);
            } else if (err instanceof CustomNotFoundError) {
                throw new NotFoundException(err?.message)
            }
            throw err;
        }
    }
}