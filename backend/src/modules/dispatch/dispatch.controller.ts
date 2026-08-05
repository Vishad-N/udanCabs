import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DispatchService } from './dispatch.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dispatch')
@Controller('dispatch')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Assign Driver & Vehicle to a Booking' })
  @ApiResponse({ status: 200, description: 'Successfully assigned driver and vehicle' })
  assignDriver(@Body() body: { bookingId: string, driverId: string, vehicleId: string, note?: string }) {
    return this.dispatchService.assignDriver(body.bookingId, body.driverId, body.vehicleId, body.note);
  }

  @Post('change-driver')
  @ApiOperation({ summary: 'Change assigned driver (and vehicle if needed)' })
  @ApiResponse({ status: 200, description: 'Successfully changed driver/vehicle' })
  changeDriver(@Body() body: { bookingId: string, newDriverId: string, newVehicleId?: string, note?: string }) {
    return this.dispatchService.changeDriver(body.bookingId, body.newDriverId, body.newVehicleId, body.note);
  }
}
