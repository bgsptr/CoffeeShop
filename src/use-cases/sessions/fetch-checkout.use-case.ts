import { Inject } from "@nestjs/common";
import { RedisUsecase } from "../redis/redis.use-case";
import { CustomNotFoundError } from "src/core/domain/errors/not-found.error";

export class FetchCheckoutUsecase {
    constructor(
        @Inject("REDIS_CLIENT")
        private readonly redisUsecase: RedisUsecase
    ) {}

    async execute(userId: string) {
        console.log("user login with id: ", userId);

        const sessionId = await this.redisUsecase.get(`session:checkout:${userId}`);
        if (!sessionId) {
            throw new CustomNotFoundError("Session ID not found");
        }

        console.log("session id: ", sessionId);
        
        const dataJson = await this.redisUsecase.get(sessionId);
        if (!dataJson) {
            throw new CustomNotFoundError(`No data found for session ID: ${sessionId}`);
        }

        console.log("data json: ", dataJson);
        
        return JSON.parse(dataJson);        
    }
}