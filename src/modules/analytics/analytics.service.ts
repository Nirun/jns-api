import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const totalLinks = await this.prisma.link.count();
        const totalClicks = await this.prisma.click.count();
        const totalCampaigns = await this.prisma.campaign.count();

        // Stats grouped by Campaign
        const campaigns = await this.prisma.campaign.findMany({
            include: {
                links: {
                    include: {
                        _count: {
                            select: { clicks: true },
                        },
                    },
                },
            },
        });

        const campaignStats = campaigns.map(c => {
            const clickCount = c.links.reduce((acc, link) => acc + link._count.clicks, 0);
            return {
                id: c.id,
                name: c.name,
                utmCampaign: c.utmCampaign,
                linkCount: c.links.length,
                clickCount,
                ctr: c.links.length > 0 ? (clickCount / c.links.length).toFixed(2) : '0.00',
            };
        });

        // Aggregate by individual links
        const links = await this.prisma.link.findMany({
            include: {
                _count: {
                    select: { clicks: true },
                },
            },
        });

        const linkStats = links.map(link => ({
            shortCode: link.shortCode,
            targetUrl: link.targetUrl,
            clickCount: link._count.clicks,
        }));

        return {
            overview: {
                totalLinks,
                totalClicks,
                totalCampaigns,
                globalCtr: totalLinks > 0 ? (totalClicks / totalLinks).toFixed(2) : '0.00',
            },
            campaignStats,
            linkStats,
        };
    }
}
