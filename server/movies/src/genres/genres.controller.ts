import { Controller, Get, Param } from "@nestjs/common";
import { GenresService } from "./genres.service";

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get('/:name')
  async getGenreByName(@Param('name') name) {
    return await this.genresService.getGenreByName(name);
  }
}
