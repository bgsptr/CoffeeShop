import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { Roles } from "src/core/domain/decorators/roles.decorator";

import { RolesGuard } from "src/core/domain/guards/role.guard";
import { CreateItemDto } from "src/core/domain/interfaces/dtos/items/create-item.dto";
import { ApiResponse } from "src/core/domain/interfaces/dtos/responses/api-response.dto";
import { Role, RoleEnum } from "src/core/domain/interfaces/dtos/users/core-user-information.dto";
import { FetchItemQuery } from "src/core/domain/interfaces/types/enum.type";
import { CreateItemUsecase } from "src/use-cases/items/create-item.use-case";
import { FetchItemsUsecase } from "src/use-cases/items/fetch-items.use-case";
import { FindItemUsecase } from "src/use-cases/items/find-item.use.case";

@Controller("items")
@UseGuards(RolesGuard)
export class ItemController {
    constructor(
        private createItemUsecase : CreateItemUsecase,
        private findItemUsecase : FindItemUsecase,
        private fetchItemsUsecase: FetchItemsUsecase
    ) {}

    @Post()
    @Roles([Role.ADMIN])
    async createNewItemController(@Res() res: Response, @Body() itemDto: CreateItemDto) {
        const itemId = await this.createItemUsecase.execute(itemDto);
        const response = new ApiResponse(res, 201, `Successfully create item with id ${itemId}`);
        return response.send();
    }

    @Get(':itemId')
    @Roles([Role.ADMIN, Role.CUSTOMER, Role.STAFF])
    async getItemByIdController(@Res() res: Response, @Param() params: { itemId: string }) {
        const itemId = params.itemId;
        const data = await this.findItemUsecase.execute(itemId);
        const response = new ApiResponse(res, 200, `Successfully fetch item with id ${itemId}`, data);
        return response.send();
    }

    @Get()
    @Roles([Role.ADMIN, Role.CUSTOMER, Role.STAFF])
    async getAllItem(@Res() res: Response, @Query() queries: FetchItemQuery) {
        const data = await this.fetchItemsUsecase.execute(queries);
        const response = new ApiResponse(res, 200, `Successfully fetch all items`, data);
        return response.send();
    }
}