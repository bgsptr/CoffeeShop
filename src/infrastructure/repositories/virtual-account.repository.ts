import { IVirtualAccountRepository } from "src/core/domain/interfaces/repositories/virtual-account.repository";
import { BaseRepository } from "./base.repository";
import { VirtualAccount } from "@prisma/client";

export class VirtualAccountRepository extends BaseRepository implements IVirtualAccountRepository {
    async create(data: VirtualAccount): Promise<void> {
        await this.prisma.virtualAccount.create({
            data: {
                id: data.id,
                paymentId: data.paymentId,
                vaNumber: data.vaNumber,
                createdAt: data.createdAt,
                expiredAt: data.expiredAt,
                status: data.status,
                bankCode: data.bankCode
            }
        })
    }
}