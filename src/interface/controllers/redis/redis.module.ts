import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { PaymentRepository } from 'src/infrastructure/repositories/payment.repository';
import { QrisRepository } from 'src/infrastructure/repositories/qris.repository';
import { redisProvider } from 'src/provider/redis.provider';
import { RedisUsecase } from 'src/use-cases/redis/redis.use-case';

@Module({
  providers: [
    redisProvider,
    PaymentRepository,
    QrisRepository,
    {
      provide: RedisUsecase,
      useFactory: (
        redisClient: Redis,
        paymentRepository: PaymentRepository,
        qrisRepository: QrisRepository,
      ) => new RedisUsecase(redisClient, paymentRepository, qrisRepository),
      inject: ['REDIS_CLIENT', PaymentRepository, QrisRepository],
    },
  ],
  exports: [RedisUsecase, 'REDIS_CLIENT', PaymentRepository, QrisRepository],
})
export class RedisModule {}
