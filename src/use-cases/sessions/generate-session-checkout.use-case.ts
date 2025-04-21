import { CheckoutDto } from "src/core/domain/interfaces/dtos/checkouts/checkout.dto";
import { RedisUsecase } from "../redis/redis.use-case";
import * as crypto from "crypto";

export interface KeyValueObject {
    key: string;
    value: string;
}

export class GenerateSessionCheckout {
    constructor(
        private readonly redisUsecase: RedisUsecase
    ) {}

    async execute(checkoutDto: CheckoutDto, userId: string): Promise<KeyValueObject> {
        const sessionID = crypto.randomBytes(32).toString('hex');
        // 60 * 30 = 1800 seconds

        await Promise.all([
            this.redisUsecase.set(`session:checkout:${userId}`, sessionID, 1800),
            this.redisUsecase.set(sessionID, JSON.stringify(checkoutDto), 1800),
        ]);
        
        return { key: "sessionId", value: sessionID };        
    }
}