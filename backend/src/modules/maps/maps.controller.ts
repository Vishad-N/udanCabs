import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MapsService } from './maps.service';
import { AutocompleteQueryDto, GeocodeQueryDto, RouteQueryDto } from './dto/maps.dto';

@ApiTags('Public - Google Maps & Routing')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get place autocomplete suggestions (Google Places or Ujjain Fallback)' })
  @ApiResponse({ status: 200, description: 'List of place suggestions' })
  autocomplete(@Query() query: AutocompleteQueryDto) {
    return this.mapsService.autocomplete(query);
  }

  @Get('geocode')
  @ApiOperation({ summary: 'Geocode address to coordinates or reverse geocode lat/lng' })
  @ApiResponse({ status: 200, description: 'Geocoded location details' })
  geocode(@Query() query: GeocodeQueryDto) {
    return this.mapsService.geocode(query);
  }

  @Get('route')
  @ApiOperation({ summary: 'Calculate distance, estimated travel time, and route polyline between origin and destination' })
  @ApiResponse({ status: 200, description: 'Route calculation details' })
  calculateRoute(@Query() query: RouteQueryDto) {
    return this.mapsService.calculateRoute(query);
  }
}
