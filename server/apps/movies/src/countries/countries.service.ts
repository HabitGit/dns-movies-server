import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Countries } from './countries.model';
import { CountriesFilms } from './countries.m2m.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateCountryDto } from '@shared/dto';
import { CountriesUpdateInterface } from '@shared';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Countries) private countriesRepository: typeof Countries,
    @InjectModel(CountriesFilms)
    private countriesFilmsRepository: typeof CountriesFilms,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCountryById(countryId: number): Promise<any> {
    const cache = await this.cacheManager.get(
      `getCountryById${JSON.stringify(countryId)}`,
    );
    if (cache) {
      return cache;
    }
    // загадочная коснтрукция
    return await this.countriesRepository
      .findOne({ where: { id: countryId } })
      .then(async (result) => {
        await this.cacheManager.set(
          `getCountryById${JSON.stringify(countryId)}`,
          result,
        );
        return result;
      });
  }

  async getAllCountries(): Promise<any> {
    const cache = await this.cacheManager.get(`getAllCountries`);
    if (cache) {
      return cache;
    }
    // то же самое. ретёрн отрабатывает только один и функция после этого схлапывается
    return await this.countriesRepository
      .findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      })
      .then(async (result) => {
        await this.cacheManager.set(`getAllCountries`, result);
        return result;
      });
  }

  // интерфейсы именуются ICountriesUpdate, country содержит country, непонятно что есть что
  async updateCountryById(country: CountriesUpdateInterface): Promise<any> {
    const countryDto: UpdateCountryDto = country.country;
    const currentCountry = await this.countriesRepository.findOne({
      where: { id: country.id },
    });
    await currentCountry.update(countryDto);
    return currentCountry;
  }

  //boolean вместо  строк, throw вместо return, два ретёрна
  async deleteCountryById(countryId: number) {
    return await this.countriesRepository
      .destroy({
        where: { id: countryId },
      })
      .then((result) => {
        if (result) {
          return 'Страна была удалена';
        } else {
          return new HttpException(
            'Удаление не удалось',
            HttpStatus.BAD_REQUEST,
          );
        }
      });
  }
}
