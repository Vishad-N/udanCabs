import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleQueryDto,
} from './dto/vehicle.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const existing = await this.prisma.vehicle.findUnique({
      where: { plateNumber: createVehicleDto.plateNumber },
    });

    if (existing) {
      throw new ConflictException(
        'A vehicle with this plate number already exists',
      );
    }

    const category = await this.prisma.vehicleCategory.findUnique({
      where: { id: createVehicleDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Vehicle category with ID ${createVehicleDto.categoryId} not found`);
    }

    if (createVehicleDto.driverId) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: createVehicleDto.driverId },
      });
      if (!driver || driver.isArchived) {
        throw new NotFoundException(`Driver with ID ${createVehicleDto.driverId} not found`);
      }
    }

    return this.prisma.vehicle.create({
      data: createVehicleDto,
      include: { driver: true, category: true },
    });
  }

  async findAll(query: VehicleQueryDto) {
    const { search, categoryId, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.VehicleWhereInput = {
      isArchived: false,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { plateNumber: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { driver: true, category: true },
      }),
      this.prisma.vehicle.count({ where }),
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
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: true,
        category: true,
      },
    });

    if (!vehicle || vehicle.isArchived) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    if (updateVehicleDto.plateNumber) {
      const existing = await this.prisma.vehicle.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { plateNumber: updateVehicleDto.plateNumber },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          'Another vehicle with this plate number already exists',
        );
      }
    }

    if (updateVehicleDto.categoryId) {
      const category = await this.prisma.vehicleCategory.findUnique({
        where: { id: updateVehicleDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Vehicle category with ID ${updateVehicleDto.categoryId} not found`);
      }
    }

    if (updateVehicleDto.driverId) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: updateVehicleDto.driverId },
      });
      if (!driver || driver.isArchived) {
        throw new NotFoundException(`Driver with ID ${updateVehicleDto.driverId} not found`);
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
      include: { driver: true, category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.vehicle.update({
      where: { id },
      data: {
        isArchived: true,
        status: 'INACTIVE',
        driverId: null,
      },
    });

    return { deleted: true, id };
  }
}
