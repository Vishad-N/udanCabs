import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TimelineModule } from '../timeline/timeline.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [TimelineModule, WhatsAppModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
