import { Controller, Post, Body, Get, Param, Res, Req, UseGuards } from '@nestjs/common';
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
