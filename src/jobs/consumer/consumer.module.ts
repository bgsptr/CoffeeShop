import { Module } from '@nestjs/common';
import { RedisUsecase } from 'src/use-cases/redis/redis.use-case';
import { ExpirePaymentConsumeJob } from './expire-payment.consumer.job';
import { RedisModule } from 'src/interface/controllers/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    RedisUsecase,
    {
      provide: ExpirePaymentConsumeJob,
      useFactory: (redisService: RedisUsecase) =>
        new ExpirePaymentConsumeJob(redisService),
      inject: [RedisUsecase],
    },
  ],
})
export class ConsumerModule {}
