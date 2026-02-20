import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { ProductsModule } from '../products/products.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule, ProductsModule],
    controllers: [OffersController],
    providers: [OffersService],
})
export class OffersModule { }
