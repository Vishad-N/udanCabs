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

export class CreateRentalDto {
  @ApiPropertyOptional({ example: 'Honda Activa 6G' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Honda' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiPropertyOptional({ example: 'Honda' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'Activa 6G DLX' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiPropertyOptional({ example: 'TWO_WHEELER', default: 'TWO_WHEELER' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 400.0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  dailyRate: number;

  @ApiPropertyOptional({ example: 1000.0, default: 1000.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  securityDeposit?: number;

  @ApiProperty({ example: 'MP13 SF 9988' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiPropertyOptional({ example: '2 Helmets included, Phone holder, Disc brakes' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'PETROL' })
  @IsString()
  @IsOptional()
  fuelType?: string;

  @ApiPropertyOptional({ example: '110cc' })
  @IsString()
  @IsOptional()
  engineCapacity?: string;

  @ApiPropertyOptional({ example: ['/uploads/activa-1.jpg', '/uploads/activa-2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'AVAILABLE', default: 'AVAILABLE' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isArchived?: boolean;
}

export class RentalQueryDto {
  @ApiPropertyOptional({ description: 'Search by name, make, model, or plateNumber' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by type' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: 'AVAILABLE' })
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
