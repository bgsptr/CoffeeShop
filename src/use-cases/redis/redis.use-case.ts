import { Inject } from "@nestjs/common";
import Redis from "ioredis";
import { PaymentRepository } from "src/infrastructure/repositories/payment.repository";
import { QrisRepository } from "src/infrastructure/repositories/qris.repository";

export class RedisUsecase {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redisClient: Redis,
        private readonly paymentRepository: PaymentRepository,
        private readonly qrisRepository: QrisRepository
    ) {}

    async set(key: string, value: string, expTimeInSecond: number): Promise<void> {
        await this.redisClient.set(key, value, 'EX', expTimeInSecond);
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async addJob(data: {
        paymentId: string,
        expiredDate: Date,
        transactionDate: Date
    }) {
        console.log(data.expiredDate);
        // const timestamps = data.expiredDate.getTime() - data.transactionDate.getTime();
        const witaUtcMS = 1 * 3600 * 1000;
        const timestamps = data.expiredDate.getTime() + witaUtcMS;
        console.log(timestamps);
        await this.redisClient.zadd("delay_expired_qris", timestamps, data.paymentId);
        console.log(`add job with payment id ${data.paymentId} to run at ${new Date(timestamps)}`);
    }

    async pollJob() {
        const jobs = await this.redisClient.zrangebyscore("delay_expired_qris", 0, Date.now());

        await Promise.all([
            await this.paymentRepository.updateStatusBatchJob(jobs),
            await this.qrisRepository.updateStatusExpiredBatchJob(jobs)
        ]);

        for (const job of jobs) {
            await this.redisClient.zrem("delay_expired_qris", job);
            console.log(`removed job containing payment id ${job}`)
        }
    }
}