import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { OffersModule } from './modules/offers/offers.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    ProductsModule,
    AffiliateModule,
    AnalyticsModule,
    OffersModule,
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
