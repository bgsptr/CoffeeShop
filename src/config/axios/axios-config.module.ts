import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { axiosInit } from 'src/config/axios/axios.init';
import { midtrans } from 'src/core/contants/variable';

@Global()
@Module({})
export class AxiosConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: AxiosConfigModule,
      providers: [
        {
          provide: 'MIDTRANS_AXIOS',
          useFactory: (): AxiosInstance =>
            axiosInit(midtrans.baseUrl, {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' +
                Buffer.from(midtrans.serverKey + ':').toString('base64'),
              Accept: 'application/json',
            } as AxiosRequestHeaders),
          inject: [],
        },
      ],
      exports: ['MIDTRANS_AXIOS'],
    };
  }
}
