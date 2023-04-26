import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genres } from './genres.model';
import { GenresFilms } from './genres.m2m.model';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genres) private genresRepository: typeof Genres,
    @InjectModel(GenresFilms) private genresFilmsRepository: typeof GenresFilms,
  ) {}

  // async getGenresByFilmId(kinopoiskId: number) {
  //   return await this.genresFilmsRepository.findAll({
  //     where: { kinopoiskFilmId: kinopoiskId },
  //   });
  // }

  async getCountryById(genreId: number) {
    return await this.genresRepository.findOne({ where: { id: genreId } });
  }

  async getFilmsIdByGenre(genre) {
    const genreId = await this.genresRepository.findOne({
      where: { genreNameRu: genre.genre },
    });
    return await this.genresFilmsRepository.findAll({
      where: { genreId: genreId.id },
    });
  }

  async createGenre(genre) {
    let isGenre = await this.genresRepository.findOne({where: {genreNameRu: genre.genre} });
    if ( !isGenre ) {
      return this.genresRepository.create({genreNameRu: genre.genre});
    }
    return isGenre;
  }

  async getGenreByName(name) {
    return await this.genresRepository.findOne({
      include: { all: true },
      where: {genreNameRu: name}
    })
  }

  async getFilmsIdByGenreId(id) {
    return await this.genresFilmsRepository.findAll({where: { genreId: id }});
  }
}
