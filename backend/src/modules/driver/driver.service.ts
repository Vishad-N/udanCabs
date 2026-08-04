import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateDriverDto,
  UpdateDriverDto,
  DriverQueryDto,
} from './dto/driver.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    const existing = await this.prisma.driver.findFirst({
      where: {
        OR: [
          { phone: createDriverDto.phone },
          { licenseNo: createDriverDto.licenseNo },
        ],
      },
    });

    if (existing) {
      throw new ConflictException(
        'A driver with this phone number or license number already exists',
      );
    }

    return this.prisma.driver.create({
      data: createDriverDto,
    });
  }

  async findAll(query: DriverQueryDto) {
    const { search, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DriverWhereInput = {
      isArchived: false,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { licenseNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.driver.count({ where }),
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
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        vehicles: true,
      },
    });

    if (!driver || driver.isArchived) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    await this.findOne(id);

    if (updateDriverDto.phone || updateDriverDto.licenseNo) {
      const existing = await this.prisma.driver.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                updateDriverDto.phone ? { phone: updateDriverDto.phone } : {},
                updateDriverDto.licenseNo
                  ? { licenseNo: updateDriverDto.licenseNo }
                  : {},
              ],
            },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          'Another driver with this phone or license number already exists',
        );
      }
    }

    return this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.driver.update({
      where: { id },
      data: {
        isArchived: true,
        status: 'INACTIVE',
      },
    });

    return { deleted: true, id };
  }
}
