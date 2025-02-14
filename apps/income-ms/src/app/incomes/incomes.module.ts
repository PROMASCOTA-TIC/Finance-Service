import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';
import { Income } from './models/income.model';
import { ProductSale } from './models/productSale.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    SequelizeModule.forFeature([Income, ProductSale]),
    ScheduleModule.forRoot(),
    HttpModule
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
