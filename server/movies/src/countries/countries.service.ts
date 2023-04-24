import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Countries } from './countries.model';
import { CountriesFilms } from './countries.m2m.model';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Countries) private countriesRepository: typeof Countries,
    @InjectModel(CountriesFilms)
    private countriesFilmsRepository: typeof CountriesFilms,
  ) {}

  // async getCountriesByFilmId(id) {
  //   return await this.countriesFilmsRepository.findAll({
  //     where: { kinopoiskFilmId: id },
  //   });
  // }

  async getCountryById(countryId: number) {
    return await this.countriesRepository.findOne({ where: { id: countryId } });
  }
}
