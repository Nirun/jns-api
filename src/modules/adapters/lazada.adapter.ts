import { Injectable } from '@nestjs/common';
import { IMarketplaceAdapter, MarketplaceProduct } from './marketplace.interface';

@Injectable()
export class LazadaAdapter implements IMarketplaceAdapter {
    async fetchProduct(urlOrSku: string): Promise<MarketplaceProduct> {
        // Mocking Lazada API response
        return {
            id: `lazada-${Math.random().toString(36).substring(2, 9)}`,
            title: `Lazada Product (${urlOrSku})`,
            price: Math.floor(Math.random() * 1000) + 100,
            currency: 'THB',
            marketplace: 'Lazada',
            storeName: 'Official Lazada Store',
            productUrl: urlOrSku,
            imageUrl: 'https://img.lazcdn.com/g/p/dummy.jpg',
        };
    }
}
