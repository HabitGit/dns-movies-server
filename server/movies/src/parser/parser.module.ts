import { Module } from '@nestjs/common';
import { FilmsModule } from '../films/films.module';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';
import { CountriesModule } from "../countries/countries.module";
import { GenresModule } from "../genres/genres.module";
import { TrailersModule } from "../trailers/trailers.module";
import { BudgetModule } from "../budget/budget.module";
import { PersonsModule } from "../persons/persons.module";

@Module({
  providers: [ParserService],
  imports: [
    FilmsModule,
    CountriesModule,
    GenresModule,
    TrailersModule,
    BudgetModule,
    PersonsModule,
  ],
  controllers: [ParserController],
})
export class ParserModule {}
