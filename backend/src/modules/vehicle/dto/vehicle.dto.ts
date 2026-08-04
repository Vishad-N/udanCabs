import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota Innova Crysta' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Innova Crysta' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2023 })
  @IsNumber()
  @Min(2000)
  @Transform(({ value }) => parseInt(value, 10))
  year: number;

  @ApiProperty({ example: 'MP13 TA 1234' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: 'uuid-of-vehicle-category' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 7 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  seatingCapacity?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  luggageCapacity?: number;

  @ApiPropertyOptional({ example: 'DIESEL' })
  @IsString()
  @IsOptional()
  fuelType?: string;

  @ApiPropertyOptional({ example: 'MANUAL' })
  @IsString()
  @IsOptional()
  transmission?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  acAvailable?: boolean;

  @ApiPropertyOptional({ example: ['/uploads/innova-1.jpg', '/uploads/innova-2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'uuid-of-driver' })
  @IsUUID()
  @IsOptional()
  driverId?: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isArchived?: boolean;
}

export class VehicleQueryDto {
  @ApiPropertyOptional({ description: 'Search by name, make, model, or plateNumber' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

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
