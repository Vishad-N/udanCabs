import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum BookingTypeEnum {
  CAB = 'CAB',
  AIRPORT_TRANSFER = 'AIRPORT_TRANSFER',
  TOUR = 'TOUR',
  RENTAL = 'RENTAL',
}

export enum BookingStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_ON_THE_WAY = 'DRIVER_ON_THE_WAY',
  TRIP_STARTED = 'TRIP_STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateBookingDto {
  @ApiPropertyOptional({ enum: BookingTypeEnum, default: BookingTypeEnum.CAB })
  @IsString()
  @IsOptional()
  bookingType?: string;

  @ApiProperty({ example: 'Rohan Sharma' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '+91 9876543210' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiPropertyOptional({ example: 'rohan@example.com' })
  @IsString()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional({ example: 'Mahakal Temple, Ujjain' })
  @IsString()
  @IsOptional()
  pickupLocation?: string;

  @ApiPropertyOptional({ example: 'Devi Ahilyabai Holkar Airport, Indore' })
  @IsString()
  @IsOptional()
  dropoffLocation?: string;

  @ApiPropertyOptional({ example: '2026-07-28' })
  @IsString()
  @IsOptional()
  pickupDate?: string;

  @ApiPropertyOptional({ example: '10:30 AM' })
  @IsString()
  @IsOptional()
  pickupTime?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  passengers?: number;

  @ApiPropertyOptional({ example: 'Sedan' })
  @IsString()
  @IsOptional()
  vehicleCategory?: string;

  @ApiPropertyOptional({ example: '6E-5432' })
  @IsString()
  @IsOptional()
  flightNumber?: string;

  @ApiPropertyOptional({ example: 'uuid-of-tour-package' })
  @IsUUID()
  @IsOptional()
  tourPackageId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-rental-vehicle' })
  @IsUUID()
  @IsOptional()
  rentalVehicleId?: string;

  @ApiPropertyOptional({ example: '2 Days' })
  @IsString()
  @IsOptional()
  rentalDuration?: string;

  @ApiPropertyOptional({ example: 'MP13 20200001111' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 'Please provide clean AC cab' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  totalFare?: number;

  @ApiPropertyOptional({ example: 'Mahakaleshwar Jyotirlinga, Ujjain' })
  @IsString()
  @IsOptional()
  pickupAddress?: string;

  @ApiPropertyOptional({ example: 23.1827 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  pickupLatitude?: number;

  @ApiPropertyOptional({ example: 75.7682 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  pickupLongitude?: number;

  @ApiPropertyOptional({ example: 'Ujjain Railway Station, Ujjain' })
  @IsString()
  @IsOptional()
  destinationAddress?: string;

  @ApiPropertyOptional({ example: 23.1821 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  destinationLatitude?: number;

  @ApiPropertyOptional({ example: 75.7766 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  destinationLongitude?: number;

  @ApiPropertyOptional({ example: 8.4 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  distance?: number;

  @ApiPropertyOptional({ example: '18 Minutes' })
  @IsString()
  @IsOptional()
  estimatedDuration?: string;

  @ApiPropertyOptional({ example: 285.0 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  estimatedFare?: number;

  @ApiPropertyOptional({ example: '{"categoryId":"...","basePrice":1200}' })
  @IsString()
  @IsOptional()
  pricingSnapshot?: string;

  @ApiPropertyOptional({ example: 'enc_23.1827_75.7682_to_23.1821_75.7766' })
  @IsString()
  @IsOptional()
  routePolyline?: string;

  @ApiPropertyOptional({ example: 'CASH_TO_DRIVER' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'PENDING' })
  @IsString()
  @IsOptional()
  paymentStatus?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiPropertyOptional({ enum: BookingStatusEnum })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'uuid-of-driver' })
  @IsUUID()
  @IsOptional()
  driverId?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatusEnum, example: BookingStatusEnum.CONFIRMED })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 'Booking confirmed by Admin. Assigned driver.' })
  @IsString()
  @IsOptional()
  note?: string;
}

export class BookingQueryDto {
  @ApiPropertyOptional({ description: 'Search by bookingNumber, customerName, or customerPhone' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: BookingStatusEnum })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ enum: BookingTypeEnum })
  @IsString()
  @IsOptional()
  bookingType?: string;

  @ApiPropertyOptional({ example: '2026-07-28' })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit?: number = 10;
}

export class CancelPublicBookingDto {
  @ApiProperty({ example: 'UC-20260727-0001' })
  @IsString()
  @IsNotEmpty()
  bookingNumber: string;

  @ApiProperty({ example: '+91 9876543210' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;
}
