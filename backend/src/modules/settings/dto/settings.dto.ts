import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpsertSettingDto {
  @ApiProperty({ example: 'contact_info' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: '{"phone":"+91 9876543210","email":"support@udancabs.com"}' })
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional({ example: 'Website contact details and address' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class BulkUpdateSettingsDto {
  @ApiProperty({ type: [UpsertSettingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertSettingDto)
  settings: UpsertSettingDto[];
}
