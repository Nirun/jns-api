import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Analytics')
@Controller('api/dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt', 'api-key']))
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get()
    @ApiOperation({ summary: 'Get dashboard statistics including CTR and click counts' })
    async getDashboard() {
        return this.analyticsService.getDashboardStats();
    }
}
