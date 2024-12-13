import { Module } from '@nestjs/common';
import { IncomesModule } from './incomes/incomes.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from '../config';
import { ProductSale } from './incomes/models/productSale.models';
import { Dialect } from 'sequelize';
import { Income } from './incomes/models/income.model';

@Module({
  imports: [
    IncomesModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbIncomeUsername,
      password: envs.dbIncomePassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Income, ProductSale],
    })
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
console.log(envs);
