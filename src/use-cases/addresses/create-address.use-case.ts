import { Address } from "@prisma/client";
import { AddressDto } from "src/core/domain/interfaces/dtos/addresses/address.dto";
import { AddressRepository } from "src/infrastructure/repositories/address.repository";
import { v4 as uuidv4 } from "uuid";

export class CreateAddressUsecase {
    constructor(
        private addressRepository: AddressRepository
    ) {}

    async execute(userId: string, data: AddressDto) {
        const addressId = uuidv4();

        const emptyAddress = await this.addressRepository.addressIsEmpty();

        const addressEntity: Address = {
            id: addressId,
            label: data.label,
            street: data?.addressData.street ?? "",
            village: data?.addressData.village ?? "",
            postalCode: data?.addressData.postalCode ?? "",
            regency: data?.addressData.regency ?? "",
            province: data?.addressData.street ?? "",
            fullAddress: data?.addressData.fullAddress ?? "",
            lat: data.lat.toString(),
            lng: data.lng.toString(),
            distance: data.distance,
            estimatedTime: data.estimatedTime,
            userId: parseInt(userId, 10),
            selected: emptyAddress,
            createdAt: new Date(),
            updatedAt: null
        }

        await this.addressRepository.create(addressEntity);

        return addressId;
    }
}