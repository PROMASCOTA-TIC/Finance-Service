import { Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesController } from './taxes.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tax } from './models/tax.model';

@Module({
  imports: [SequelizeModule.forFeature([Tax]), ScheduleModule.forRoot(), HttpModule],
  controllers: [TaxesController],
  providers: [TaxesService],
})
export class TaxesModule {}
