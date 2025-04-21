import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SessionController } from './session.controller';
import { RedisUsecase } from 'src/use-cases/redis/redis.use-case';
import { GenerateSessionCheckout } from 'src/use-cases/sessions/generate-session-checkout.use-case';
import { RedisModule } from '../redis/redis.module';
import { FetchCheckoutUsecase } from 'src/use-cases/sessions/fetch-checkout.use-case';
import { SessionMiddleware } from 'src/interface/middlewares/session.middleware';
import { AuthMiddleware } from 'src/interface/middlewares/auth.middleware';
import { QrisRepository } from 'src/infrastructure/repositories/qris.repository';

@Module({
  imports: [RedisModule],
  controllers: [SessionController],
  providers: [
    RedisUsecase,
    {
      provide: GenerateSessionCheckout,
      useFactory: (redisUsecase: RedisUsecase) =>
        new GenerateSessionCheckout(redisUsecase),
      inject: [RedisUsecase],
    },
    {
      provide: FetchCheckoutUsecase,
      useFactory: (redisUsecase: RedisUsecase) =>
        new FetchCheckoutUsecase(redisUsecase),
      inject: [RedisUsecase],
    },
  ],
})

export class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(SessionMiddleware)
    //     .forRoutes({ path: 'sessions/checkout', method: RequestMethod.GET });

    consumer
      .apply(AuthMiddleware)
        .forRoutes(SessionController);
  }
}
