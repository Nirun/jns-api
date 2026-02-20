import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt', 'api-key']))
@Controller('api/campaigns')
export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new marketing campaign' })
    create(@Body() createCampaignDto: CreateCampaignDto) {
        return this.campaignsService.create(createCampaignDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all campaigns and their link counts' })
    findAll() {
        return this.campaignsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get campaign details including related links' })
    findOne(@Param('id') id: string) {
        return this.campaignsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing campaign' })
    update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
        return this.campaignsService.update(id, updateCampaignDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a campaign' })
    remove(@Param('id') id: string) {
        return this.campaignsService.remove(id);
    }
}
