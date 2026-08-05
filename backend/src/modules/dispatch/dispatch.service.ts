import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TimelineService } from '../timeline/timeline.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class DispatchService {
  constructor(
    private prisma: PrismaService,
    private timelineService: TimelineService,
    private whatsappService: WhatsAppService
  ) {}

  async assignDriver(bookingId: string, driverId: string, vehicleId: string, note?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver || driver.isArchived) throw new NotFoundException('Driver not found');
    
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle || vehicle.isArchived) throw new NotFoundException('Vehicle not found');

    // Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'DRIVER_ASSIGNED',
        assignedDriverId: driverId,
        assignedVehicleId: vehicleId,
        assignedAt: new Date(),
      },
      include: {
        assignedDriver: true,
        assignedVehicle: true,
      }
    });

    // Update driver status
    await this.prisma.driver.update({
      where: { id: driverId },
      data: { status: 'ASSIGNED' }
    });

    // Update vehicle status
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'RESERVED' }
    });

    // Record Timeline
    await this.timelineService.addEvent(
      bookingId,
      'Driver Assigned',
      note || `Assigned driver ${driver.name} with vehicle ${vehicle.plateNumber}`
    );

    // Notify Customer
    await this.whatsappService.notifyCustomerDriverAssigned(updatedBooking);

    return updatedBooking;
  }

  async changeDriver(bookingId: string, newDriverId: string, newVehicleId?: string, note?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const oldDriverId = booking.assignedDriverId;
    const oldVehicleId = booking.assignedVehicleId;

    // Free old driver/vehicle
    if (oldDriverId) {
      await this.prisma.driver.update({ where: { id: oldDriverId }, data: { status: 'ACTIVE' } });
    }
    if (oldVehicleId) {
      await this.prisma.vehicle.update({ where: { id: oldVehicleId }, data: { status: 'ACTIVE' } });
    }

    const assignedVehicleId = newVehicleId || oldVehicleId;
    if (!assignedVehicleId) {
       throw new BadRequestException('A vehicle must be assigned');
    }

    const newDriver = await this.prisma.driver.findUnique({ where: { id: newDriverId } });
    const assignedVehicle = await this.prisma.vehicle.findUnique({ where: { id: assignedVehicleId } });

    // Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        assignedDriverId: newDriverId,
        assignedVehicleId,
      },
      include: {
        assignedDriver: true,
        assignedVehicle: true,
      }
    });

    // Reserve new driver/vehicle
    await this.prisma.driver.update({ where: { id: newDriverId }, data: { status: 'ASSIGNED' } });
    await this.prisma.vehicle.update({ where: { id: assignedVehicleId }, data: { status: 'RESERVED' } });

    // Timeline
    await this.timelineService.addEvent(
      bookingId,
      'Driver Changed',
      note || `Driver changed to ${newDriver?.name}`
    );

    // Notify
    await this.whatsappService.notifyCustomerDriverAssigned(updatedBooking);

    return updatedBooking;
  }
}
