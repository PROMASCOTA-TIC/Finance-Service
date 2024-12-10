import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from '../config';
import { Dialect } from 'sequelize';
import { Transaction } from './transactions/models/transactions.model';

@Module({
  imports: [
    TransactionsModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbTransactionUsername,
      password: envs.dbTransactionPassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Transaction],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
