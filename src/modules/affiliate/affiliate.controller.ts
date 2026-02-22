import { Controller, Post, Body, Get, Param, Res, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { CreateLinkDto } from './dto/affiliate.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Affiliate')
@Controller()
export class AffiliateController {
    constructor(private affiliateService: AffiliateService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(['jwt', 'api-key']))
    @Post('api/links')
    @ApiOperation({ summary: 'Create a new affiliate link with a 6-character short code' })
    async createLink(@Body() data: CreateLinkDto) {
        return this.affiliateService.createLink(data);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(['jwt', 'api-key']))
    @Get('api/links')
    @ApiOperation({ summary: 'Get all affiliate links' })
    async findAllLinks() {
        return this.affiliateService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(['jwt', 'api-key']))
    @Patch('api/links/:id')
    @ApiOperation({ summary: 'Update an affiliate link' })
    async updateLink(@Param('id') id: string, @Body() data: any) {
        return this.affiliateService.update(id, data);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(['jwt', 'api-key']))
    @Delete('api/links/:id')
    @ApiOperation({ summary: 'Delete an affiliate link' })
    async removeLink(@Param('id') id: string) {
        return this.affiliateService.remove(id);
    }

    @Get('go/:short_code')
    @ApiOperation({ summary: 'Resolve short code and redirect to target URL' })
    async redirect(
        @Param('short_code') shortCode: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const userAgent = req.headers['user-agent'];
        const referrer = req.headers['referer'] as string;
        const targetUrl = await this.affiliateService.resolveShortCode(shortCode, userAgent, referrer);
        return res.redirect(302, targetUrl);
    }
}
