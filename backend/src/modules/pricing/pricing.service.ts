import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePricingDto, UpdatePricingDto, CreateCategoryDto, EstimateFareDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async estimateFare(dto: EstimateFareDto) {
    const whereClause: any = { status: 'ACTIVE' };
    if (dto.categoryId) {
      whereClause.categoryId = dto.categoryId;
    }

    const pricingList = await this.prisma.vehiclePricing.findMany({
      where: whereClause,
      include: {
        category: {
          include: {
            vehicles: {
              where: { status: 'ACTIVE', isArchived: false },
              take: 1,
            },
          },
        },
      },
      orderBy: { basePrice: 'asc' },
    });

    const dist = dto.distance || 0;
    let isNight = false;
    if (dto.pickupTime) {
      const parts = dto.pickupTime.split(':');
      if (parts.length >= 2) {
        const hour = parseInt(parts[0], 10);
        if (!isNaN(hour) && (hour >= 22 || hour < 6)) {
          isNight = true;
        }
      }
    }

    const estimations = pricingList.map((item) => {
      const included = item.includedKm ?? 0;
      const billableKm = Math.max(0, dist - included);
      let fare = item.basePrice + billableKm * item.pricePerKm;

      if (item.minFare && fare < item.minFare) {
        fare = item.minFare;
      }

      if (isNight && item.nightCharge) {
        if (item.nightCharge <= 50) {
          fare += fare * (item.nightCharge / 100);
        } else {
          fare += item.nightCharge;
        }
      }

      const estimatedFare = Math.round(fare);
      const firstVehicle = item.category?.vehicles?.[0];
      const catName = item.category?.name?.toLowerCase() || '';

      const seatingCapacity =
        firstVehicle?.seatingCapacity ||
        (catName.includes('traveller') ? 12 : catName.includes('innova') ? 7 : catName.includes('suv') ? 6 : 4);

      const luggageCapacity =
        firstVehicle?.luggageCapacity ||
        (catName.includes('traveller') ? 8 : catName.includes('innova') ? 5 : catName.includes('suv') ? 4 : 2);

      const image = firstVehicle?.images?.[0] || '';

      const pricingSnapshot = JSON.stringify({
        categoryId: item.categoryId,
        categoryName: item.category?.name,
        basePrice: item.basePrice,
        includedKm: item.includedKm,
        pricePerKm: item.pricePerKm,
        minFare: item.minFare,
        waitingCharge: item.waitingCharge,
        nightCharge: item.nightCharge,
        appliedDistance: dist,
        appliedDuration: dto.duration || 0,
        isNightChargeApplied: isNight,
        calculatedAt: new Date().toISOString(),
      });

      return {
        id: item.id,
        categoryId: item.categoryId,
        categoryName: item.category?.name || 'Cab',
        categoryDescription: item.category?.description || '',
        estimatedFare,
        basePrice: item.basePrice,
        includedKm: item.includedKm,
        pricePerKm: item.pricePerKm,
        minFare: item.minFare,
        seatingCapacity,
        luggageCapacity,
        image,
        pricingSnapshot,
      };
    });

    return {
      success: true,
      distance: dist,
      duration: dto.duration || 0,
      isNightTime: isNight,
      data: estimations,
    };
  }

  // Vehicle Category methods
  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.vehicleCategory.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.vehicleCategory.create({ data: dto });
  }

  async findAllCategories() {
    const data = await this.prisma.vehicleCategory.findMany({
      orderBy: { name: 'asc' },
      include: { pricing: true },
    });
    return { data };
  }

  // Vehicle Pricing methods
  async create(createPricingDto: CreatePricingDto) {
    const existing = await this.prisma.vehiclePricing.findUnique({
      where: { categoryId: createPricingDto.categoryId },
    });

    if (existing) {
      throw new ConflictException(
        `Pricing for this vehicle category already exists`,
      );
    }

    const category = await this.prisma.vehicleCategory.findUnique({
      where: { id: createPricingDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${createPricingDto.categoryId} not found`);
    }

    return this.prisma.vehiclePricing.create({
      data: createPricingDto,
      include: { category: true },
    });
  }

  async findAll() {
    const data = await this.prisma.vehiclePricing.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return { data };
  }

  async findOne(id: string) {
    const pricing = await this.prisma.vehiclePricing.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!pricing) {
      throw new NotFoundException(`Pricing rule with ID ${id} not found`);
    }

    return pricing;
  }

  async findByCategory(categoryId: string) {
    const pricing = await this.prisma.vehiclePricing.findUnique({
      where: { categoryId },
      include: { category: true },
    });

    if (!pricing) {
      throw new NotFoundException(`Pricing rule for category ID ${categoryId} not found`);
    }

    return pricing;
  }

  async update(id: string, updatePricingDto: UpdatePricingDto) {
    await this.findOne(id);

    if (updatePricingDto.categoryId) {
      const existing = await this.prisma.vehiclePricing.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { categoryId: updatePricingDto.categoryId },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          `Pricing rule for this vehicle category already exists`,
        );
      }
    }

    return this.prisma.vehiclePricing.update({
      where: { id },
      data: updatePricingDto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.vehiclePricing.delete({
      where: { id },
    });
    return { deleted: true, id };
  }
}
