import { Inject, OnModuleInit } from '@nestjs/common';
import { Interval, ScheduleModule } from '@nestjs/schedule';
import { RedisUsecase } from 'src/use-cases/redis/redis.use-case';

export class ExpirePaymentConsumeJob implements OnModuleInit {
  constructor(
    @Inject('REDIS')
    private readonly redisService: RedisUsecase
  ) {}

  onModuleInit() {
    setInterval(() => this.redisService.pollJob(), 1000);
  }
}
