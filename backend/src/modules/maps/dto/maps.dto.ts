import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AutocompleteQueryDto {
  @ApiProperty({ example: 'Mahakal Temple', description: 'Search input text for location autocomplete' })
  @IsString()
  @IsNotEmpty()
  input: string;
}

export class GeocodeQueryDto {
  @ApiPropertyOptional({ example: 'Mahakaleshwar Jyotirlinga, Ujjain, Madhya Pradesh', description: 'Address to geocode into lat/lng' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 23.1827, description: 'Latitude for reverse geocoding' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 75.7682, description: 'Longitude for reverse geocoding' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lng?: number;
}

export class RouteQueryDto {
  @ApiProperty({ example: 'Mahakaleshwar Temple, Ujjain', description: 'Origin location address or coordinates' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'Ujjain Railway Station, Ujjain', description: 'Destination location address or coordinates' })
  @IsString()
  @IsNotEmpty()
  destination: string;
}
