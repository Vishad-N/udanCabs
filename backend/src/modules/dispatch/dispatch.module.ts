import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { TimelineModule } from '../timeline/timeline.module';

@Module({
  imports: [PrismaModule, WhatsAppModule, TimelineModule],
  controllers: [DispatchController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
