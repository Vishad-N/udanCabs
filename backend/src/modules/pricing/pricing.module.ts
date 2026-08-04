import { Module } from '@nestjs/common';
import { PricingController, PublicPricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  controllers: [PricingController, PublicPricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
