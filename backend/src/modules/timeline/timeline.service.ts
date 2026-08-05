import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async addEvent(bookingId: string, event: string, remarks?: string, createdBy: string = 'SYSTEM') {
    return this.prisma.bookingTimeline.create({
      data: {
        bookingId,
        event,
        remarks,
        createdBy,
      },
    });
  }

  async getTimeline(bookingId: string) {
    return this.prisma.bookingTimeline.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
