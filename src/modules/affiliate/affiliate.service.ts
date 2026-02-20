import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/affiliate.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AffiliateService {
    constructor(private prisma: PrismaService) { }

    async createLink(data: CreateLinkDto) {
        const shortCode = nanoid(6);
        return this.prisma.link.create({
            data: {
                ...data,
                shortCode,
            },
        });
    }

    async resolveShortCode(shortCode: string, userAgent?: string, referrer?: string) {
        const link = await this.prisma.link.findUnique({
            where: { shortCode },
        });

        if (!link) {
            throw new NotFoundException('Short code not found');
        }

        // Log the click
        await this.prisma.click.create({
            data: {
                linkId: link.id,
                userAgent,
                referrer,
            },
        });

        return link.targetUrl;
    }
}
