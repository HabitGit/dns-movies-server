import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.CLOUDAMQP_URL],
  //     queue: process.env.MOVIES_QUEUE,
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const PORT = 3000;

  await app.listen(PORT, () => {
    console.log(`Сервер запущен на внутреннем порту ${PORT}`);
  }); // Внутри контейнера порт 3000 всегда

}
bootstrap();
