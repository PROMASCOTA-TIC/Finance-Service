import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Income } from './models/productSale.models';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SequelizeModule.forFeature([Income]),
    ScheduleModule.forRoot()
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
