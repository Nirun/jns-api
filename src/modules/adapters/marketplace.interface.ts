export interface MarketplaceProduct {
    id: string;
    title: string;
    price: number;
    currency: string;
    marketplace: string;
    storeName: string;
    productUrl: string;
    imageUrl?: string;
}

export interface IMarketplaceAdapter {
    fetchProduct(urlOrSku: string): Promise<MarketplaceProduct>;
}
