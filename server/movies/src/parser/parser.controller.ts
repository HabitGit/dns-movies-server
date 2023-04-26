import { Controller, Get, Param } from "@nestjs/common";
import { ParserService } from './parser.service';
import { annotateModelWithIndex } from "sequelize-typescript";

@Controller('parser')
export class ParserController {
  constructor(private parserService: ParserService) {}
  @Get()
  async startParser() {
    await this.parserService.startParser();
    return 'done';
  }

  @Get('/test')
  test() {
    return 'work';
  }

  @Get('/:id')
  getFilm(@Param('id') id) {
    return this.parserService.getFilm(id)
  }
}
