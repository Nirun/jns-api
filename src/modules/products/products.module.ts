import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AdaptersModule } from '../adapters/adapters.module';
import { AffiliateModule } from '../affiliate/affiliate.module';

@Module({
    imports: [AdaptersModule, AffiliateModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }
