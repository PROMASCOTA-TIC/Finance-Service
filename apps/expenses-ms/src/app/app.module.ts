import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './expenses/models/expense.model';
import { envs } from 'config';
import { Dialect } from 'sequelize';


@Module({
  imports: [
    ExpensesModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
      models: [Expense],
    })
  ],
})
export class AppModule {}
