import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Films } from './films.model';
import { CountriesService } from '../countries/countries.service';
import { GenresService } from '../genres/genres.service';
import { BudgetService } from '../budget/budget.service';
import { ClientProxy } from '@nestjs/microservices';
import { Op } from 'sequelize';
import { CreateFilmDto } from './dto/create.film.dto';
import { SimilarFilms } from "./films.similar.m2m.model";
import { Similar } from "./films.similar.model";

@Injectable()
export class FilmsService {
  constructor(
    @Inject('MOVIES-SERVICE') private usersClient: ClientProxy,
    @InjectModel(Films) private filmsRepository: typeof Films,
    @InjectModel(Similar) private similarFilmsRepository: typeof SimilarFilms,
    private countriesService: CountriesService,
    private genresService: GenresService,
    private budgetService: BudgetService,
  ) {}
  async createFilm(film: CreateFilmDto) {
    if ( !await this.filmsRepository.findOne({where: { kinopoiskId: film.kinopoiskId }}) ) {
      return await this.filmsRepository.create(film);
    }
  }

  async createSimilarFilms(similar) {
    return await this.similarFilmsRepository.create(similar);
  }

  async getAllFilms(params) {
    const { page, size, title } = params;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = this.getPagination(page, size);

    return await this.filmsRepository.findAndCountAll({
      where: condition,
      offset: offset,
      limit: limit,
    });
  }

  // async getFilmById(id) {
  //   const result = [];
  //   const currentCountries = [];
  //   const currentGenres = [];
  //   const currentBudget = [];
  //
  //   const currentFilm = await this.filmsRepository.findOne({
  //     where: { kinopoiskId: id.id },
  //   });
  //
  //   const currentCountriesId = await this.countriesService.getCountriesByFilmId(
  //     currentFilm.kinopoiskId,
  //   );
  //   for (const country of currentCountriesId) {
  //     currentCountries.push(
  //       await this.countriesService.getCountryById(country.countryId),
  //     );
  //   }
  //
  //   const currentGenresId = await this.genresService.getGenresByFilmId(
  //     currentFilm.kinopoiskId,
  //   );
  //   for (const genre of currentGenresId) {
  //     currentGenres.push(
  //       await this.genresService.getCountryById(genre.genreId),
  //     );
  //   }
  //
  //   const currentBudgetId = await this.budgetService.getBudgetByFilmId(
  //     currentFilm.kinopoiskId,
  //   );
  //   for (const budget of currentBudgetId) {
  //     currentBudget.push(
  //       await this.budgetService.getBudgetById(budget.budgetId),
  //     );
  //   }
  //
  //   const currentStaff = await lastValueFrom(
  //     this.usersClient.send({ cmd: 'get-staff' }, currentFilm.kinopoiskId),
  //   );
  //
  //   result.push({
  //     film: currentFilm,
  //     countries: currentCountries,
  //     genre: currentGenres,
  //     budget: currentBudget,
  //     staff: currentStaff,
  //   });
  //
  //   return result;
  // }

  private getPagination(page, size) {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
  }

  // async getFilmsByGenre(genre) {
  //   const allFilmsByGenre = [];
  //   const filmsId = await this.genresService.getFilmsIdByGenre(genre);
  //
  //   for (const item of filmsId) {
  //     allFilmsByGenre.push(
  //       await this.filmsRepository.findOne({
  //         where: { kinopoiskId: item.kinopoiskFilmId },
  //       }),
  //     );
  //   }
  //   return allFilmsByGenre;
  // }
  async getTestFilm(id) {
    return await this.filmsRepository.findOne({
      include: { all: true },
      where: { kinopoiskId: id }
    })
  };

  async getFilmsByGenre(name) {
    let array = [];
    let genre = await this.genresService.getGenreByName(name);
    let filmsId = await this.genresService.getFilmsIdByGenreId(genre.id);
    for ( let item of filmsId ) {
      array.push(await this.filmsRepository.findOne({
        include: { all: true },
        where: { id: item.filmId }
      }))
    }
    return array;
  }
}
