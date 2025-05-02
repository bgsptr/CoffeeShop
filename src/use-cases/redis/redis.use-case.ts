import { Inject } from "@nestjs/common";
import Redis from "ioredis";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";
import { PaymentRepository } from "src/infrastructure/repositories/payment.repository";
import { QrisRepository } from "src/infrastructure/repositories/qris.repository";

export class RedisUsecase {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redisClient: Redis,
        private readonly paymentRepository: PaymentRepository,
        private readonly qrisRepository: QrisRepository,
        private readonly orderRepository: OrderRepository
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
        transactionDate: Date,
        orderId: string
    }) {
        console.log(data.expiredDate);
        // const timestamps = data.expiredDate.getTime() - data.transactionDate.getTime();
        const witaUtcMS = 1 * 3600 * 1000;
        const timestamps = data.expiredDate.getTime() + witaUtcMS;
        console.log(timestamps);
        await this.redisClient.zadd("delay_expired_qris", timestamps, `payment:${data.paymentId}`);
        await this.redisClient.zadd("delay_expired_qris", timestamps, `order:${data.orderId}`);
        console.log(`add job with payment id ${data.paymentId} and order id ${data.orderId} to run at ${new Date(timestamps)}`);
    }

    async pollJob() {
        const jobs = await this.redisClient.zrangebyscore("delay_expired_qris", 0, Date.now());

        const paymentIds = jobs.filter(j => j.startsWith("payment:")).map(j => j.replace("payment:", ""));
        const orderIds = jobs.filter(j => j.startsWith("order:")).map(j => j.replace("order:", "")).map(Number);

        await Promise.all([
            await this.paymentRepository.updateStatusBatchJob(paymentIds),
            await this.qrisRepository.updateStatusExpiredBatchJob(paymentIds),
            await this.orderRepository.rollbackStatusToPendingBatchJob(orderIds)
        ]);

        for (const job of jobs) {
            await this.redisClient.zrem("delay_expired_qris", job);
            console.log(`removed job containing payment id ${job}`)
        }
    }
}