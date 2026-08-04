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
import { TourService } from './tour.service';
import { CreateTourDto, UpdateTourDto, TourQueryDto } from './dto/tour.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Tour Packages')
@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new tour package' })
  @ApiResponse({ status: 201, description: 'Tour package created successfully' })
  create(@Body() createTourDto: CreateTourDto) {
    return this.tourService.create(createTourDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tour packages with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of tour packages' })
  findAll(@Query() query: TourQueryDto) {
    return this.tourService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tour package details by ID' })
  @ApiResponse({ status: 200, description: 'Tour package details' })
  @ApiResponse({ status: 404, description: 'Tour package not found' })
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update tour package details' })
  @ApiResponse({ status: 200, description: 'Tour package updated successfully' })
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a tour package' })
  @ApiResponse({ status: 200, description: 'Tour package archived successfully' })
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
