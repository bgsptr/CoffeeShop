import { VirtualAccount } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IVirtualAccountRepository extends Repository<VirtualAccount> {
    create(data: VirtualAccount): Promise<void>;
}