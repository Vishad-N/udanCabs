import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TimelineService } from '../timeline/timeline.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
  BookingQueryDto,
  BookingStatusEnum,
  CancelPublicBookingDto,
} from './dto/booking.dto';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private timelineService: TimelineService,
    private whatsappService: WhatsAppService
  ) {}

  private parseBooking(booking: any) {
    if (!booking) return booking;
    const { timelines, ...rest } = booking;
    return {
      ...rest,
      timeline: timelines || [],
    };
  }

  private get commonIncludes() {
    return {
      tourPackage: true,
      rentalVehicle: true,
      driver: true,
      assignedDriver: true,
      assignedVehicle: true,
      timelines: {
        orderBy: { createdAt: 'asc' as Prisma.SortOrder },
      },
    };
  }

  async generateBookingNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const prefix = `UC-${year}${month}${day}-`;

    const lastBooking = await this.prisma.booking.findFirst({
      where: {
        bookingNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        bookingNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastBooking && lastBooking.bookingNumber) {
      const lastSequence = parseInt(lastBooking.bookingNumber.replace(prefix, ''), 10);
      if (!isNaN(lastSequence)) {
        nextNumber = lastSequence + 1;
      }
    }

    const sequenceStr = String(nextNumber).padStart(4, '0');
    return `${prefix}${sequenceStr}`;
  }

  async create(createBookingDto: CreateBookingDto) {
    const bookingNumber = await this.generateBookingNumber();

    const data: Prisma.BookingCreateInput = {
      bookingNumber,
      bookingType: createBookingDto.bookingType || 'CAB',
      customerName: createBookingDto.customerName,
      customerPhone: createBookingDto.customerPhone,
      customerEmail: createBookingDto.customerEmail,
      pickupLocation: createBookingDto.pickupLocation || createBookingDto.pickupAddress,
      dropoffLocation: createBookingDto.dropoffLocation || createBookingDto.destinationAddress,
      pickupDate: createBookingDto.pickupDate,
      pickupTime: createBookingDto.pickupTime,
      passengers: createBookingDto.passengers,
      vehicleCategory: createBookingDto.vehicleCategory,
      flightNumber: createBookingDto.flightNumber,
      rentalDuration: createBookingDto.rentalDuration,
      licenseNumber: createBookingDto.licenseNumber,
      notes: createBookingDto.notes,
      totalFare: createBookingDto.totalFare || createBookingDto.estimatedFare,
      pickupAddress: createBookingDto.pickupAddress || createBookingDto.pickupLocation,
      pickupLatitude: createBookingDto.pickupLatitude,
      pickupLongitude: createBookingDto.pickupLongitude,
      destinationAddress: createBookingDto.destinationAddress || createBookingDto.dropoffLocation,
      destinationLatitude: createBookingDto.destinationLatitude,
      destinationLongitude: createBookingDto.destinationLongitude,
      distance: createBookingDto.distance,
      estimatedDuration: createBookingDto.estimatedDuration,
      estimatedFare: createBookingDto.estimatedFare || createBookingDto.totalFare,
      pricingSnapshot: createBookingDto.pricingSnapshot,
      routePolyline: createBookingDto.routePolyline,
      paymentMethod: createBookingDto.paymentMethod,
      paymentStatus: createBookingDto.paymentStatus || 'PENDING',
      status: BookingStatusEnum.PENDING,
    };

    if (createBookingDto.tourPackageId) {
      data.tourPackage = { connect: { id: createBookingDto.tourPackageId } };
    }

    if (createBookingDto.rentalVehicleId) {
      data.rentalVehicle = { connect: { id: createBookingDto.rentalVehicleId } };
    }

    const saved = await this.prisma.booking.create({
      data,
    });

    // Create initial timeline event
    await this.timelineService.addEvent(
      saved.id,
      'Booking Created',
      createBookingDto.notes || 'Customer submitted booking request'
    );

    const fullBooking = await this.prisma.booking.findUnique({
      where: { id: saved.id },
      include: this.commonIncludes,
    });

    // Notify Business Owner
    await this.whatsappService.notifyBusinessOwnerNewBooking(fullBooking);

    return this.parseBooking(fullBooking);
  }

  async findAll(query: BookingQueryDto) {
    const { search, status, bookingType, date, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {
      isArchived: false,
    };

    if (status) {
      where.status = status;
    }

    if (bookingType) {
      where.bookingType = bookingType;
    }

    if (date) {
      where.pickupDate = date;
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.commonIncludes,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: data.map((b) => this.parseBooking(b)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        AND: [
          {
            OR: [{ id }, { bookingNumber: id }],
          },
          { isArchived: false },
        ],
      },
      include: this.commonIncludes,
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID or Number "${id}" not found`);
    }

    return this.parseBooking(booking);
  }

  async findByNumberOrPhone(identifier: string) {
    if (!identifier || identifier.trim() === '') {
      return { data: [] };
    }

    const cleanId = identifier.trim();
    const bookings = await this.prisma.booking.findMany({
      where: {
        AND: [
          { isArchived: false },
          {
            OR: [
              { bookingNumber: { equals: cleanId, mode: 'insensitive' } },
              { customerPhone: { contains: cleanId, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: this.commonIncludes,
    });

    return { data: bookings.map((b) => this.parseBooking(b)) };
  }

  async cancelPublic(dto: CancelPublicBookingDto) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        bookingNumber: dto.bookingNumber,
        customerPhone: dto.customerPhone,
        isArchived: false,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found with provided credentials');
    }

    if (booking.status !== BookingStatusEnum.PENDING && booking.status !== BookingStatusEnum.CONFIRMED) {
      throw new BadRequestException('Booking cannot be cancelled at this stage. Please contact office.');
    }

    const saved = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatusEnum.CANCELLED,
      },
      include: this.commonIncludes,
    });

    await this.timelineService.addEvent(
      booking.id,
      'Booking Cancelled',
      'Customer cancelled the booking from the website'
    );

    if (booking.assignedDriverId) {
      await this.prisma.driver.update({ where: { id: booking.assignedDriverId }, data: { status: 'ACTIVE' } });
    }
    if (booking.assignedVehicleId) {
      await this.prisma.vehicle.update({ where: { id: booking.assignedVehicleId }, data: { status: 'ACTIVE' } });
    }

    if ((this.whatsappService as any).notifyCustomerCancellation) {
      await (this.whatsappService as any).notifyCustomerCancellation(saved);
    }

    return this.parseBooking(saved);
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    const saved = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: dto.status,
      },
      include: this.commonIncludes,
    });

    if (dto.status === BookingStatusEnum.COMPLETED || dto.status === BookingStatusEnum.CANCELLED) {
      if (booking.assignedDriverId) {
        await this.prisma.driver.update({ where: { id: booking.assignedDriverId }, data: { status: 'ACTIVE' } });
      }
      if (booking.assignedVehicleId) {
        await this.prisma.vehicle.update({ where: { id: booking.assignedVehicleId }, data: { status: 'ACTIVE' } });
      }
    }

    await this.timelineService.addEvent(
      booking.id,
      `Status updated to ${dto.status}`,
      dto.note || `Booking status changed from ${booking.status} to ${dto.status}`
    );

    const finalBooking = await this.prisma.booking.findUnique({
      where: { id: booking.id },
      include: this.commonIncludes,
    });

    return this.parseBooking(finalBooking);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    const { driverId, ...rest } = updateBookingDto;

    const data: Prisma.BookingUpdateInput = { ...rest };
    if (driverId) {
      data.driver = { connect: { id: driverId } };
    }

    const saved = await this.prisma.booking.update({
      where: { id: booking.id },
      data,
      include: this.commonIncludes,
    });

    return this.parseBooking(saved);
  }

  async remove(id: string) {
    const booking = await this.findOne(id);

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        isArchived: true,
        status: BookingStatusEnum.CANCELLED,
      },
    });

    return { deleted: true, id: booking.id };
  }
}
