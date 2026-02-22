import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateLinkDto } from './dto/affiliate.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AffiliateService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    async createLink(data: CreateLinkDto) {
        const shortCode = nanoid(6);
        const link = await this.prisma.link.create({
            data: {
                ...data,
                shortCode,
            },
        });

        // Pre-cache the new link
        await this.redis.set(`link:${shortCode}`, link.targetUrl, 3600);
        await this.redis.set(`link_id:${shortCode}`, link.id, 3600);

        return link;
    }

    async ensureDefaultCampaign() {
        let campaign = await this.prisma.campaign.findFirst({
            where: { name: 'General' },
        });

        if (!campaign) {
            campaign = await this.prisma.campaign.create({
                data: {
                    name: 'General',
                    utmCampaign: 'general_auto',
                },
            });
        }

        return campaign;
    }

    async autoGenerateLinks(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { offers: true },
        });

        if (!product || !product.offers.length) return;

        const defaultCampaign = await this.ensureDefaultCampaign();

        for (const offer of product.offers) {
            // Check if link already exists for this product + targetUrl
            const existingLink = await this.prisma.link.findFirst({
                where: {
                    productId,
                    targetUrl: offer.productUrl,
                },
            });

            if (!existingLink) {
                const shortCode = nanoid(6);
                await this.prisma.link.create({
                    data: {
                        productId,
                        campaignId: defaultCampaign.id,
                        targetUrl: offer.productUrl,
                        shortCode,
                    },
                });
            }
        }
    }

    async resolveShortCode(shortCode: string, userAgent?: string, referrer?: string) {
        let targetUrl = await this.redis.get<string>(`link:${shortCode}`);
        let linkId: string;

        if (!targetUrl) {
            const link = await this.prisma.link.findUnique({
                where: { shortCode },
            });

            if (!link) {
                throw new NotFoundException('Short code not found');
            }

            targetUrl = link.targetUrl;
            linkId = link.id;

            // Cache for 1 hour
            await this.redis.set(`link:${shortCode}`, targetUrl, 3600);
            // Also cache linkId to avoid DB lookup for click logging
            await this.redis.set(`link_id:${shortCode}`, linkId, 3600);
        } else {
            const cachedLinkId = await this.redis.get<string>(`link_id:${shortCode}`);
            if (cachedLinkId) {
                linkId = cachedLinkId;
            } else {
                // Fallback if targetUrl exists but linkId is missing
                const link = await this.prisma.link.findUnique({
                    where: { shortCode },
                    select: { id: true }
                });
                linkId = link?.id || '';
                if (linkId) await this.redis.set(`link_id:${shortCode}`, linkId, 3600);
            }
        }

        // Log the click (Asynchronous background task)
        if (linkId) {
            this.prisma.click.create({
                data: {
                    linkId,
                    userAgent,
                    referrer,
                },
            }).catch(err => console.error('Failed to log click:', err));
        }

        return targetUrl as string;
    }

    async findAll() {
        return this.prisma.link.findMany({
            include: {
                product: { select: { title: true } },
                campaign: { select: { name: true } },
                _count: { select: { clicks: true } },
            },
        });
    }

    async update(id: string, data: any) {
        const link = await this.prisma.link.update({
            where: { id },
            data,
        });

        // Invalidate cache
        await this.redis.del(`link:${link.shortCode}`);
        await this.redis.del(`link_id:${link.shortCode}`);

        return link;
    }

    async remove(id: string) {
        const link = await this.prisma.link.findUnique({ where: { id } });
        if (link) {
            await this.redis.del(`link:${link.shortCode}`);
            await this.redis.del(`link_id:${link.shortCode}`);
        }

        return this.prisma.link.delete({
            where: { id },
        });
    }
}
