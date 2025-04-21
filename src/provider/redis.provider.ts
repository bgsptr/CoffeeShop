import { Provider } from "@nestjs/common";
import Redis from "ioredis";

export const redisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    useFactory: (): Redis => {
        return new Redis({
            host: process.env.REDIS_HOST ?? "34.128.113.155",
            port: 6379,
            username: process.env.REDIS_USERNAME ?? "default",
            password: process.env.REDIS_PASSWORD ?? "putrawanganteng"
        });
    }
}