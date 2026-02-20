import { Injectable } from '@nestjs/common';
import { IMarketplaceAdapter, MarketplaceProduct } from './marketplace.interface';

@Injectable()
export class ShopeeAdapter implements IMarketplaceAdapter {
    async fetchProduct(urlOrSku: string): Promise<MarketplaceProduct> {
        // Mocking Shopee API response
        return {
            id: `shopee-${Math.random().toString(36).substring(2, 9)}`,
            title: `Shopee Product (${urlOrSku})`,
            price: Math.floor(Math.random() * 1000) + 50,
            currency: 'THB',
            marketplace: 'Shopee',
            storeName: 'Top Shopee Seller',
            productUrl: urlOrSku,
            imageUrl: 'https://cf.shopee.co.th/file/dummy.jpg',
        };
    }
}
