import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTourDto {
  @ApiProperty({ example: 'Mahakaleshwar & Omkareshwar Darshan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Complete spiritual journey covering 2 Jyotirlingas of Madhya Pradesh.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  durationDays: number;

  @ApiPropertyOptional({ example: '2 Days / 1 Night' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ example: '/uploads/cover-mahakal.jpg' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ example: ['/uploads/tour-1.jpg', '/uploads/tour-2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  galleryImages?: string[];

  @ApiPropertyOptional({ example: 'Day 1: Arrival & Mahakaleshwar Darshan. Day 2: Omkareshwar Excursion & Drop.' })
  @IsString()
  @IsOptional()
  itinerary?: string;

  @ApiPropertyOptional({ example: 'Ujjain Railway Station / Hotel' })
  @IsString()
  @IsOptional()
  pickupPoint?: string;

  @ApiPropertyOptional({ example: ['AC Sedan vehicle', 'Toll taxes & parking', 'Driver allowance'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includedServices?: string[];

  @ApiPropertyOptional({ example: ['Temple entry tickets', 'Meals & accommodation'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excludedServices?: string[];

  @ApiProperty({ example: 4500.0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiPropertyOptional({ example: 4500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  sedanPrice?: number;

  @ApiPropertyOptional({ example: 6500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  suvPrice?: number;

  @ApiPropertyOptional({ example: 7500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  innovaPrice?: number;

  @ApiPropertyOptional({ example: 9500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  travellerPrice?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateTourDto extends PartialType(CreateTourDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isArchived?: boolean;
}

export class TourQueryDto {
  @ApiPropertyOptional({ description: 'Search by tour name or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter active status' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit?: number = 10;
}
