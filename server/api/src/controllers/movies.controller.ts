import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('movies')
export class MoviesController {

    constructor(
        @Inject('MOVIES-SERVICE') private moviesService: ClientProxy,
    ) {}

    @Get()
    async getAllFilms(@Query() param) {
        return this.moviesService.send({ cmd : 'get-all-films' }, param);
    }

    @Get('/:id/about')
    async getFilmById(@Param() id: number) {
        return this.moviesService.send({ cmd : 'get-film-byId' }, id);
    }

    @Get('/:genre')
    async filerByGenre(@Param() genre: string) {
        return this.moviesService.send({ cmd : 'get-films-byGenre' }, genre);
    }
}