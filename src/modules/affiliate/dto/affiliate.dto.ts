import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
    @ApiProperty({ example: 'uuid-of-product', description: 'The ID of the product' })
    productId: string;

    @ApiProperty({ example: 'uuid-of-campaign', description: 'The ID of the campaign' })
    campaignId: string;

    @ApiProperty({ example: 'https://example.com/target', description: 'The destination URL' })
    targetUrl: string;
}

export class UpdateLinkDto {
    @ApiProperty({ example: 'https://example.com/target', description: 'The destination URL', required: false })
    targetUrl?: string;

    @ApiProperty({ example: 'uuid-of-campaign', description: 'The ID of the campaign', required: false })
    campaignId?: string;
}
