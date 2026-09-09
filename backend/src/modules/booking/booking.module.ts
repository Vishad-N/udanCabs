import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TimelineModule } from '../timeline/timeline.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TimelineModule, WhatsAppModule, UploadModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
