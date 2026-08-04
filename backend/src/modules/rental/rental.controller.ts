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
import { RentalService } from './rental.service';
import { CreateRentalDto, UpdateRentalDto, RentalQueryDto } from './dto/rental.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Two Wheeler Rentals')
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new two-wheeler rental item' })
  @ApiResponse({ status: 201, description: 'Rental item created successfully' })
  @ApiResponse({ status: 409, description: 'Registration number already exists' })
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.create(createRentalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all two-wheeler rentals with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of two-wheeler rentals' })
  findAll(@Query() query: RentalQueryDto) {
    return this.rentalService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rental item details by ID' })
  @ApiResponse({ status: 200, description: 'Rental item details' })
  @ApiResponse({ status: 404, description: 'Rental item not found' })
  findOne(@Param('id') id: string) {
    return this.rentalService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update rental item details' })
  @ApiResponse({ status: 200, description: 'Rental item updated successfully' })
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalService.update(id, updateRentalDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a rental item' })
  @ApiResponse({ status: 200, description: 'Rental item archived successfully' })
  remove(@Param('id') id: string) {
    return this.rentalService.remove(id);
  }
}
