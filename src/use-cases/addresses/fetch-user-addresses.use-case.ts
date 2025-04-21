import { AddressRepository } from "src/infrastructure/repositories/address.repository";
import { FetchAddressQuery } from "src/interface/controllers/addresses/address.controller";

export class FetchUserAddressesUsecase {
    constructor(
        private addressRepository: AddressRepository
    ) {}

    async execute(userId: string, query?: FetchAddressQuery) {
        const parseUserId = parseInt(userId, 10);
        try {

            if (query && query.limit === "1") {
                return await this.addressRepository.findFirstCreated(parseUserId, query.sort, query.order);
            }

            return await this.addressRepository.findAll(parseUserId);

        } catch(err) {
            console.error(err)
            return [];
        }
    }
}