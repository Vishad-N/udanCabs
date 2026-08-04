import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateRentalDto,
  UpdateRentalDto,
  RentalQueryDto,
} from './dto/rental.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async create(createRentalDto: CreateRentalDto) {
    const existing = await this.prisma.rentalVehicle.findUnique({
      where: { plateNumber: createRentalDto.plateNumber },
    });

    if (existing) {
      throw new ConflictException(
        'A rental vehicle with this plate number already exists',
      );
    }

    return this.prisma.rentalVehicle.create({
      data: createRentalDto,
    });
  }

  async findAll(query: RentalQueryDto) {
    const { search, type, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.RentalVehicleWhereInput = {
      isArchived: false,
    };

    if (type) {
      where.type = { equals: type, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { plateNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.rentalVehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalVehicle.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const rental = await this.prisma.rentalVehicle.findUnique({
      where: { id },
    });

    if (!rental || rental.isArchived) {
      throw new NotFoundException(`Rental vehicle with ID "${id}" not found`);
    }

    return rental;
  }

  async update(id: string, updateRentalDto: UpdateRentalDto) {
    await this.findOne(id);

    if (updateRentalDto.plateNumber) {
      const existing = await this.prisma.rentalVehicle.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { plateNumber: updateRentalDto.plateNumber },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          'Another rental vehicle with this plate number already exists',
        );
      }
    }

    return this.prisma.rentalVehicle.update({
      where: { id },
      data: updateRentalDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.rentalVehicle.update({
      where: { id },
      data: {
        isArchived: true,
        status: 'INACTIVE',
      },
    });

    return { deleted: true, id };
  }
}
