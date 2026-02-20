import { Module } from '@nestjs/common';
import { LazadaAdapter } from './lazada.adapter';
import { ShopeeAdapter } from './shopee.adapter';

@Module({
    providers: [LazadaAdapter, ShopeeAdapter],
    exports: [LazadaAdapter, ShopeeAdapter],
})
export class AdaptersModule { }
