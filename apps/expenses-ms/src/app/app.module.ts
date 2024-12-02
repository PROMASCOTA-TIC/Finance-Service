import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './expenses/models/expense.model';
import { Dialect } from 'sequelize';
import { envs } from '../config';


@Module({
  imports: [
    ExpensesModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbExpenseUsername,
      password: envs.dbExpensePassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,      },
      models: [Expense],
    })
  ],
})
export class AppModule {}
console.log(envs)
