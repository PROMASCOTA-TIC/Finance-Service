import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './models/transactions.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../config';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
    ScheduleModule.forRoot(),
    HttpModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
