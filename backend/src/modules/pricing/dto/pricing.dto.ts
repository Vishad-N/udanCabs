import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sedan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '4-seater AC Sedan (Dzire/Etios)' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePricingDto {
  @ApiProperty({ example: 'uuid-of-vehicle-category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 1200.0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  basePrice: number;

  @ApiPropertyOptional({ example: 80.0, default: 80.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  includedKm?: number;

  @ApiProperty({ example: 14.0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  pricePerKm: number;

  @ApiPropertyOptional({ example: 2.0, default: 2.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  pricePerMinute?: number;

  @ApiPropertyOptional({ example: 300.0, default: 300.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  minFare?: number;

  @ApiPropertyOptional({ example: 100.0, default: 100.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  waitingCharge?: number;

  @ApiPropertyOptional({ example: 250.0, default: 250.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  nightCharge?: number;

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdatePricingDto extends PartialType(CreatePricingDto) {}

export class EstimateFareDto {
  @ApiProperty({ example: 8.4, description: 'Distance in kilometers' })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  distance: number;

  @ApiPropertyOptional({ example: 18, description: 'Estimated travel time in minutes' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  duration?: number;

  @ApiPropertyOptional({ example: '22:30', description: 'Pickup time string (to apply night charge between 22:00 and 06:00)' })
  @IsString()
  @IsOptional()
  pickupTime?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category', description: 'Optional vehicle category ID to estimate for a specific category only' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
