import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Films } from './films.model';
import { CountriesModule } from '../countries/countries.module';
import { GenresModule } from '../genres/genres.module';
import { BudgetModule } from '../budget/budget.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SimilarFilms } from "./films.similar.m2m.model";
import { Similar } from "./films.similar.model";

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  imports: [
    ClientsModule.register([
      {
        name: 'MOVIES-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.CLOUDAMQP_URL],
          queue: process.env.MOVIES_QUEUE,
          queueOptions: { durable: false },
        },
      },
    ]),
    SequelizeModule.forFeature([Films, Similar, SimilarFilms]),
    CountriesModule,
    GenresModule,
    BudgetModule,
  ],
  exports: [
    FilmsService,
  ]
})
export class FilmsModule {}
