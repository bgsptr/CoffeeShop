import { Item, Order } from "@prisma/client"
import { FetchOrderDto } from "../../interfaces/dtos/orders/fetch-order.dto"
import { IMapper } from "../../interfaces/providers/mapper.provider.interface"
import { Decimal } from "@prisma/client/runtime/library"

export class FetchOrderMapper implements IMapper<FetchOrderDto, Order> {
    // mapFromDto(input: CoreUserInformationDto, email: string, birthDate: Date): PatientEntity {
    //     return new PatientEntity(
    //         input.full_name,
    //         email,
    //         "id",
    //         birthDate, // still string
    //         input.gender,
    //         input.domicile,
    //         "0"
    //     )
    // }

    mapFromEntity(orderId: number, items: any[], totalPrice: Decimal): FetchOrderDto {
        return new FetchOrderDto(
            orderId,
            items,
            totalPrice
        )
    }
}