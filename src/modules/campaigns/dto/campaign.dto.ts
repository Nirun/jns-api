import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCampaignDto {
    @ApiProperty({ example: 'Summer Sale 2026', description: 'Name of the campaign' })
    name: string;

    @ApiProperty({ example: 'summer_sale_26', description: 'UTM Campaign parameter' })
    utmCampaign: string;

    @ApiProperty({ example: '2026-06-01T00:00:00Z', description: 'Start date of the campaign', required: false })
    startAt?: Date;

    @ApiProperty({ example: '2026-08-31T23:59:59Z', description: 'End date of the campaign', required: false })
    endAt?: Date;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) { }
