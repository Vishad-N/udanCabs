import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTourDto, UpdateTourDto, TourQueryDto } from './dto/tour.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  async create(createTourDto: CreateTourDto) {
    return this.prisma.tourPackage.create({
      data: createTourDto,
    });
  }

  async findAll(query: TourQueryDto) {
    const { search, isActive, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TourPackageWhereInput = {
      isArchived: false,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.tourPackage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tourPackage.count({ where }),
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
    const tour = await this.prisma.tourPackage.findFirst({
      where: {
        id,
        isArchived: false,
      },
    });

    if (!tour) {
      throw new NotFoundException(`Tour package with ID "${id}" not found`);
    }

    return tour;
  }

  async update(id: string, updateTourDto: UpdateTourDto) {
    await this.findOne(id);

    return this.prisma.tourPackage.update({
      where: { id },
      data: updateTourDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.tourPackage.update({
      where: { id },
      data: {
        isArchived: true,
        isActive: false,
        status: 'INACTIVE',
      },
    });

    return { deleted: true, id };
  }
}
