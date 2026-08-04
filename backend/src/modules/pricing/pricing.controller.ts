import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { CreatePricingDto, UpdatePricingDto, CreateCategoryDto, EstimateFareDto } from './dto/pricing.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Public - Fare Estimation & Categories')
@Controller('pricing')
export class PublicPricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('estimate')
  @ApiOperation({ summary: 'Calculate estimated fares across vehicle categories based on route distance and duration' })
  @ApiResponse({ status: 200, description: 'Estimated fares list with rate snapshot' })
  estimateFare(@Query() query: EstimateFareDto) {
    return this.pricingService.estimateFare(query);
  }

  @Get('public-categories')
  @ApiOperation({ summary: 'Get all active vehicle categories for customer booking' })
  @ApiResponse({ status: 200, description: 'List of active vehicle categories' })
  findAllCategories() {
    return this.pricingService.findAllCategories();
  }
}

@ApiTags('Admin - Pricing & Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('categories')
  @ApiOperation({ summary: 'Create a new vehicle category (Sedan, SUV, etc.)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.pricingService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all vehicle categories with their pricing' })
  @ApiResponse({ status: 200, description: 'List of vehicle categories' })
  findAllCategories() {
    return this.pricingService.findAllCategories();
  }

  @Post()
  @ApiOperation({ summary: 'Create dynamic pricing rule for a vehicle category' })
  @ApiResponse({ status: 201, description: 'Pricing rule created successfully' })
  @ApiResponse({ status: 409, description: 'Pricing for this category already exists' })
  create(@Body() createPricingDto: CreatePricingDto) {
    return this.pricingService.create(createPricingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicle pricing rules' })
  @ApiResponse({ status: 200, description: 'List of pricing rules' })
  findAll() {
    return this.pricingService.findAll();
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get pricing rule by vehicle category ID' })
  @ApiResponse({ status: 200, description: 'Pricing details' })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.pricingService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pricing rule by ID' })
  @ApiResponse({ status: 200, description: 'Pricing details' })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  findOne(@Param('id') id: string) {
    return this.pricingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pricing rule parameters' })
  @ApiResponse({ status: 200, description: 'Pricing updated successfully' })
  update(@Param('id') id: string, @Body() updatePricingDto: UpdatePricingDto) {
    return this.pricingService.update(id, updatePricingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a pricing rule' })
  @ApiResponse({ status: 200, description: 'Pricing deleted successfully' })
  remove(@Param('id') id: string) {
    return this.pricingService.remove(id);
  }
}

