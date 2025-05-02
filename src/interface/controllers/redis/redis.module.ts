import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository';
import { PaymentRepository } from 'src/infrastructure/repositories/payment.repository';
import { QrisRepository } from 'src/infrastructure/repositories/qris.repository';
import { redisProvider } from 'src/provider/redis.provider';
import { RedisUsecase } from 'src/use-cases/redis/redis.use-case';

@Module({
  providers: [
    redisProvider,
    PaymentRepository,
    QrisRepository,
    OrderRepository,
    {
      provide: RedisUsecase,
      useFactory: (
        redisClient: Redis,
        paymentRepository: PaymentRepository,
        qrisRepository: QrisRepository,
        orderRepository: OrderRepository,
      ) => new RedisUsecase(redisClient, paymentRepository, qrisRepository, orderRepository),
      inject: ['REDIS_CLIENT', PaymentRepository, QrisRepository, OrderRepository],
    },
  ],
  exports: [RedisUsecase, 'REDIS_CLIENT', PaymentRepository, QrisRepository, OrderRepository],
})
export class RedisModule {}
