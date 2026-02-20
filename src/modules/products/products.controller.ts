import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@ApiHeader({
    name: 'X-API-KEY',
    description: 'User-specific API Key',
    required: false,
})
@Controller('api/products')
@UseGuards(AuthGuard(['jwt', 'api-key']))
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with their offers' })
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single product by ID' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    create(@Body() data: CreateProductDto) {
        return this.productsService.create(data);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing product' })
    update(@Param('id') id: string, @Body() data: UpdateProductDto) {
        return this.productsService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
