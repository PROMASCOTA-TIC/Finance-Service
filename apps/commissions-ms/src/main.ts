import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { envs } from './config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        url: envs.natsServers,
      },
    }
  );
  await app.listen();
  Logger.log(
    ` Commissions Microservice is running`
  );
}

bootstrap();
