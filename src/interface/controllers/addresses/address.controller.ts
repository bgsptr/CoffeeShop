import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FindUserId } from 'src/core/domain/decorators/get-user-email.decorator';
import { AddressDto } from 'src/core/domain/interfaces/dtos/addresses/address.dto';
import { CheckoutDto } from 'src/core/domain/interfaces/dtos/checkouts/checkout.dto';
import { ApiResponse } from 'src/core/domain/interfaces/dtos/responses/api-response.dto';
import { CreateAddressUsecase } from 'src/use-cases/addresses/create-address.use-case';
import { FetchUserAddressesUsecase } from 'src/use-cases/addresses/fetch-user-addresses.use-case';

export interface FetchAddressQuery {
  sort: string;
  order: string;
  limit: string;
}

@Controller('addresses')
export class AddressController {
  constructor(
    private createAddressUsecase: CreateAddressUsecase,
    private fetchUserAddressesUsecase: FetchUserAddressesUsecase,
  ) {}

  @Post()
  async createNewAddressController(
    @Res() res: Response,
    @Body() body: AddressDto,
    @FindUserId() userId: string,
  ) {
    console.log('pusing: ', userId);
    const addressId = await this.createAddressUsecase.execute(userId, body);

    if (addressId) {
      const finalData = body;
      const response = new ApiResponse(
        res,
        HttpStatus.OK,
        `success create new address with id ${addressId}`,
        {
          addressId,
          addressBody: finalData
        },
      );

      // set

      return response.send();
    }
  }

  @Get()
  async fetchAllAddress(
    @Res() res: Response,
    @FindUserId() userId: string,
    @Query() query: FetchAddressQuery,
  ) {
    const addresses = await this.fetchUserAddressesUsecase.execute(
      userId,
      query,
    );

    const response = new ApiResponse(
      res,
      HttpStatus.OK,
      `fetch collection of user's address with id ${userId}`,
      {
        userId,
        addresses,
      },
    );
    return response.send();
  }
}
