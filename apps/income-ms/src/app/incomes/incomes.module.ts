import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Income } from './models/income.models';

@Module({
  imports: [
    SequelizeModule.forFeature([Income]),
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
