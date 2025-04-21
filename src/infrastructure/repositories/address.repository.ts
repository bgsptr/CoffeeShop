import { IAddressRepository } from "src/core/domain/interfaces/repositories/address.repository.interface";
import { BaseRepository } from "./base.repository";
import { Address } from "@prisma/client";
import { SortSQL } from "src/core/domain/interfaces/types/enum.type";

export class AddressRepository extends BaseRepository implements IAddressRepository {
    async create(data: Address, ...args: any): Promise<any> {
        await this.prisma.address.create({
            data: {
                id: data.id,
                label: data.label,
                street: data.street,
                village: data.village,
                postalCode: data.postalCode,
                regency: data.regency,
                province: data.province,
                fullAddress: data.fullAddress,
                lat: data.lat,
                lng: data.lng,
                distance: data.distance,
                userId: data.userId,
                estimatedTime: data.estimatedTime,
                selected: data.selected
            }
        })
    }

    async findAll(userId: number): Promise<Address[]> {
        return await this.prisma.address.findMany({
            where: {
                userId
            },
        })
    }

    async findFirstCreated(userId: number, sort: string, order: string): Promise<Address> {
        return await this.prisma.address.findFirstOrThrow({
            orderBy: {
                createdAt: order === 'asc' ? SortSQL.ASC : SortSQL.DESC
            },
            where: {
                userId
            },
        })
    }

    async addressIsEmpty(): Promise<boolean> {
        return (await this.prisma.address.count()) === 0;
    }

    async findSelectedAddress(userId: string) {
        return await this.prisma.address.findFirst({
            where: {
                userId: Number(userId)
            }
        })
    }
}