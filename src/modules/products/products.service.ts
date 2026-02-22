import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AffiliateService } from '../affiliate/affiliate.service';
import { Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { LazadaAdapter } from '../adapters/lazada.adapter';
import { ShopeeAdapter } from '../adapters/shopee.adapter';
import { MarketplaceProduct } from '../adapters/marketplace.interface';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private lazadaAdapter: LazadaAdapter,
        private shopeeAdapter: ShopeeAdapter,
        private affiliateService: AffiliateService,
    ) { }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany({
            include: {
                offers: true,
                links: true,
            },
        });
    }

    async findOne(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                offers: true,
                links: true,
            },
        });
    }

    /**
     * Create a Master Product record.
     * Marketplace syncing is now decoupled.
     */
    async create(data: CreateProductDto): Promise<Product> {
        const { title, imageUrl, lazadaUrl, shopeeUrl } = data;

        const product = await this.prisma.product.create({
            data: {
                title,
                imageUrl,
            },
            include: {
                offers: true,
            },
        });

        // Proactively sync if URLs are provided
        if (lazadaUrl || shopeeUrl) {
            await this.syncOffers(product.id, lazadaUrl, shopeeUrl);
        } else {
            // Even if no sync, generate links if there are manual offers (though rare in current flow)
            await this.affiliateService.autoGenerateLinks(product.id);
        }

        const finalProduct = await this.findOne(product.id);
        if (!finalProduct) throw new NotFoundException('Product creation failed');
        return finalProduct;
    }

    /**
     * Decoupled sync logic to fetch and store marketplace data in the Offer table.
     */
    async syncOffers(productId: string, lazadaUrl?: string, shopeeUrl?: string): Promise<void> {
        const collectedOffers: MarketplaceProduct[] = [];

        if (lazadaUrl) {
            try {
                const res = await this.lazadaAdapter.fetchProduct(lazadaUrl);
                collectedOffers.push(res);
            } catch (e) {
                console.error('Lazada Sync Failed', e);
            }
        }

        if (shopeeUrl) {
            try {
                const res = await this.shopeeAdapter.fetchProduct(shopeeUrl);
                collectedOffers.push(res);
            } catch (e) {
                console.error('Shopee Sync Failed', e);
            }
        }

        for (const offer of collectedOffers) {
            await this.prisma.offer.upsert({
                where: {
                    // We don't have a unique constraint on marketplace+url yet in schema, 
                    // so we'll just create for now or assume productId+marketplace is unique for this simplified logic.
                    id: 'placeholder-if-we-want-upsert', // This won't work without a proper unique key
                },
                update: {
                    price: offer.price,
                    title: offer.title,
                    imageUrl: offer.imageUrl,
                    lastCheckedAt: new Date(),
                },
                create: {
                    productId,
                    marketplace: offer.marketplace,
                    storeName: offer.storeName,
                    title: offer.title,
                    imageUrl: offer.imageUrl,
                    price: offer.price,
                    productUrl: offer.productUrl,
                },
            }).catch(async () => {
                // Fallback to simple create if upsert fails due to placeholder id
                await this.prisma.offer.create({
                    data: {
                        productId,
                        marketplace: offer.marketplace,
                        storeName: offer.storeName,
                        title: offer.title,
                        imageUrl: offer.imageUrl,
                        price: offer.price,
                        productUrl: offer.productUrl,
                    }
                });
            });
        }

        // Auto-generate affiliate links after sync
        await this.affiliateService.autoGenerateLinks(productId);
    }

    async update(id: string, data: UpdateProductDto): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Product> {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
