import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './interface/controllers/users/user.module';
import { ChatbotModule } from './interface/websockets/chatbots/chatbot.module';
import { DecimalProvider } from './provider/decimal.provider';
import { ItemModule } from './interface/controllers/items/item.module';
import { OrderModule } from './interface/controllers/orders/order.module';
import { OrderItemModule } from './interface/controllers/orders_items/order-item.module';
import { redisProvider } from './provider/redis.provider';
import { RedisModule } from './interface/controllers/redis/redis.module';
import { SessionModule } from './interface/controllers/sessions/session.module';
import { AddressModule } from './interface/controllers/addresses/address.module';
import { ImageModule } from './interface/controllers/images/image.module';
import { PaymentModule } from './interface/controllers/payments/payment.module';
import { AxiosConfigModule } from './config/axios/axios-config.module';
import { GoogleProvider } from './provider/google.provider';
import { GoogleModule } from './config/oauth_google/google.module';
import { ConsumerModule } from './jobs/consumer/consumer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [redisProvider, DecimalProvider, GoogleProvider],
  imports: [
    UserModule,
    ItemModule,
    OrderModule,
    OrderItemModule,
    ChatbotModule,
    RedisModule,
    SessionModule,
    AddressModule,
    ImageModule,
    PaymentModule,
    GoogleModule,
    ConsumerModule,
    ScheduleModule.forRoot(),
    AxiosConfigModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  exports: [redisProvider, DecimalProvider, GoogleProvider],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
