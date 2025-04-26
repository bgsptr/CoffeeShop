import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const redisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Redis => {
        return new Redis({
            host: configService.get("REDIS_HOST"),
            port: 6379,
            username: configService.get("REDIS_USERNAME"),
            password: configService.get("REDIS_PASSWORD")
        });
    }
}