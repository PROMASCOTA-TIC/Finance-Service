import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    }
  );

  await app.listen();

  Logger.log(
    "Transaction microservice is running", "TransactionMicroservice"
  );
}

bootstrap();
