import { ApiProperty } from '@nestjs/swagger';

export class AddOfferDto {
    @ApiProperty({ example: 'Lazada', description: 'The marketplace name' })
    marketplace: string;

    @ApiProperty({ example: 'Official Store', description: 'The store name' })
    storeName: string;

    @ApiProperty({ example: 1200.50, description: 'Product price' })
    price: number;

    @ApiProperty({ example: 'https://lazada.co.th/item', description: 'Product URL' })
    productUrl: string;

    @ApiProperty({ example: 'Marketplace Product Title', description: 'Title on the marketplace', required: false })
    title?: string;

    @ApiProperty({ example: 'https://img.lazcdn.com/item.jpg', description: 'Image URL on the marketplace', required: false })
    imageUrl?: string;
}

export class SyncOfferDto {
    @ApiProperty({ example: 'https://lazada.co.th/item', description: 'Lazada URL', required: false })
    lazadaUrl?: string;

    @ApiProperty({ example: 'https://shopee.co.th/item', description: 'Shopee URL', required: false })
    shopeeUrl?: string;
}
