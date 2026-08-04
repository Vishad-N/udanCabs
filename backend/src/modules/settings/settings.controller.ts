import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpsertSettingDto, BulkUpdateSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Website Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all website configuration settings' })
  @ApiResponse({ status: 200, description: 'List of settings' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get configuration setting by key' })
  @ApiResponse({ status: 200, description: 'Setting value and metadata' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create or update a setting by key (upsert)' })
  @ApiResponse({ status: 201, description: 'Setting saved successfully' })
  upsert(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.settingsService.upsert(upsertSettingDto);
  }

  @Post('bulk')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Bulk create or update multiple settings' })
  @ApiResponse({ status: 201, description: 'Settings saved successfully' })
  bulkUpsert(@Body() bulkUpdateSettingsDto: BulkUpdateSettingsDto) {
    return this.settingsService.bulkUpsert(bulkUpdateSettingsDto);
  }

  @Delete(':key')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a setting by key' })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
