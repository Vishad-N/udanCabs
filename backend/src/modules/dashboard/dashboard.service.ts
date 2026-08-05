import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BookingStatusEnum } from '../booking/dto/booking.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistics() {
    const [
      totalBookings,
      pendingTrips,
      activeDrivers,
      fleetCount,
      activeTours,
      rentalBikes,
    ] = await Promise.all([
      this.prisma.booking.count({ where: { isArchived: false } }),
      this.prisma.booking.count({
        where: { status: BookingStatusEnum.PENDING, isArchived: false },
      }),
      this.prisma.driver.count({
        where: { status: 'ACTIVE', isArchived: false },
      }),
      this.prisma.vehicle.count({ where: { isArchived: false } }),
      this.prisma.tourPackage.count({
        where: { status: 'ACTIVE', isArchived: false },
      }),
      this.prisma.rentalVehicle.count({
        where: { status: 'AVAILABLE', isArchived: false },
      }),
    ]);

    return {
      totalBookings,
      pendingTrips,
      activeDrivers,
      fleetCount,
      activeTours,
      rentalBikes,
    };
  }
}
