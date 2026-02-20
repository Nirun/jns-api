import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Apple iPhone 15', description: 'The title of the product' })
    title: string;

    @ApiProperty({
        example: 'https://example.com/iphone-15.jpg',
        description: 'URL of the product image',
        required: false,
    })
    imageUrl?: string;

    @ApiProperty({
        example: 'https://www.lazada.co.th/products/item.html',
        description: 'URL of the product on Lazada',
        required: false,
    })
    lazadaUrl?: string;

    @ApiProperty({
        example: 'https://shopee.co.th/product-item',
        description: 'URL of the product on Shopee',
        required: false,
    })
    shopeeUrl?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }
