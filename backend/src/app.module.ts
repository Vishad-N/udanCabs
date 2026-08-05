import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { DriverModule } from './modules/driver/driver.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { TourModule } from './modules/tour/tour.module';
import { RentalModule } from './modules/rental/rental.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadModule } from './modules/upload/upload.module';
import { HealthModule } from './modules/health/health.module';
import { MapsModule } from './modules/maps/maps.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { AuditModule } from './modules/audit/audit.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    BookingModule,
    DriverModule,
    VehicleModule,
    PricingModule,
    TourModule,
    RentalModule,
    SettingsModule,
    UploadModule,
    HealthModule,
    MapsModule,
    WhatsAppModule,
    TimelineModule,
    DispatchModule,
    AuditModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
