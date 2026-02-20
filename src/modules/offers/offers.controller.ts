import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { AddOfferDto, SyncOfferDto } from './dto/offer.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Offers')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt', 'api-key']))
@Controller('api/products/:productId/offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all marketplace offers for a master product' })
    async findAll(@Param('productId') productId: string) {
        return this.offersService.getOffersByProduct(productId);
    }

    @Post()
    @ApiOperation({ summary: 'Manually add a marketplace offer to a product' })
    async create(@Param('productId') productId: string, @Body() data: AddOfferDto) {
        return this.offersService.addOffer(productId, data);
    }

    @Post('sync')
    @ApiOperation({ summary: 'Sync marketplace data and attach to product' })
    async sync(@Param('productId') productId: string, @Body() data: SyncOfferDto) {
        return this.offersService.syncOffers(productId, data);
    }
}
