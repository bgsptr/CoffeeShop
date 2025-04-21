import { Address } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IAddressRepository extends Repository<Address> {
    create(data: Address, ...args: any): Promise<any>;
    findAll(userId: number): Promise<Address[]>;
    findFirstCreated(userId: number, sort: string, limit: string): Promise<Address>;
}