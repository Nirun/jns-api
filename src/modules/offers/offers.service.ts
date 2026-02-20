import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddOfferDto, SyncOfferDto } from './dto/offer.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OffersService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
    ) { }

    async getOffersByProduct(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { offers: true },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product.offers;
    }

    async addOffer(productId: string, data: AddOfferDto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('Product not found');

        return this.prisma.offer.create({
            data: {
                ...data,
                productId,
            },
        });
    }

    async syncOffers(productId: string, data: SyncOfferDto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('Product not found');

        await this.productsService.syncOffers(productId, data.lazadaUrl, data.shopeeUrl);

        return this.prisma.offer.findMany({
            where: { productId },
        });
    }
}
