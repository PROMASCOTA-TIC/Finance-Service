import { Module } from '@nestjs/common';
import { TaxesModule } from './taxes/taxes.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from '../config';
import { Dialect } from 'sequelize';
import { Tax } from './taxes/models/tax.model';

@Module({
  imports: [
    TaxesModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbTaxesUsername,
      password: envs.dbTaxesPassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Tax],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
