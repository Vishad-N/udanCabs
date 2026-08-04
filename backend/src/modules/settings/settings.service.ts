import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpsertSettingDto, BulkUpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private parseValue(setting: any) {
    if (!setting) return setting;
    try {
      return { ...setting, value: JSON.parse(setting.value) };
    } catch {
      return setting;
    }
  }

  async findAll() {
    const settings = await this.prisma.websiteSettings.findMany({
      orderBy: { key: 'asc' },
    });
    return { data: settings.map((s) => this.parseValue(s)) };
  }

  async findByKey(key: string) {
    const setting = await this.prisma.websiteSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    return this.parseValue(setting);
  }

  async upsert(upsertDto: UpsertSettingDto) {
    const { key, value, description } = upsertDto;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    const saved = await this.prisma.websiteSettings.upsert({
      where: { key },
      update: {
        value: stringValue,
        ...(description !== undefined ? { description } : {}),
      },
      create: {
        key,
        value: stringValue,
        description,
      },
    });

    return this.parseValue(saved);
  }

  async bulkUpsert(bulkDto: BulkUpdateSettingsDto) {
    const results = await Promise.all(
      bulkDto.settings.map((s) => this.upsert(s)),
    );
    return { data: results };
  }

  async remove(key: string) {
    const existing = await this.prisma.websiteSettings.findUnique({
      where: { key },
    });
    if (!existing) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    await this.prisma.websiteSettings.delete({
      where: { key },
    });
    return { deleted: true, key };
  }
}
