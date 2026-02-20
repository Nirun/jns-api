import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.campaign.findMany({
            include: {
                _count: {
                    select: { links: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
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
        if (!campaign) throw new NotFoundException('Campaign not found');
        return campaign;
    }

    async create(data: CreateCampaignDto) {
        return this.prisma.campaign.create({
            data,
        });
    }

    async update(id: string, data: UpdateCampaignDto) {
        return this.prisma.campaign.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.campaign.delete({
            where: { id },
        });
    }
}
