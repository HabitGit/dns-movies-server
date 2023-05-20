import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCountryDto } from '@shared/dto';

import { RolesGuard } from '../guards/roles.guard';
import { RoleAccess } from '../guards/roles.decorator';
import { initRoles } from '../guards/init.roles';
import { AllExceptionsFilter } from '../filters/all.exceptions.filter';

@UseFilters(AllExceptionsFilter)
@ApiTags('Фильмы-страны')
@Controller('movies')
export class MoviesCountriesController {
  constructor(@Inject('MOVIES-SERVICE') private moviesService: ClientProxy) {}

  @ApiOperation({ summary: 'Получение списка стран' })
  // как недавно узнали в description response пишем "Запрос успешен" "Не удалось найти айди" итд итп
  // можно добавить ApiResponse для ошибок
  // в ApiResponse нет типа возвращаемого объекта
  @ApiResponse({ status: 200, description: 'Выводит список всех стран' })
  @Get('/countries')
  getAllCountries() {
    return this.moviesService.send({ cmd: 'get-all-countries' }, {});
  }

  @ApiOperation({ summary: 'Получение страны по айди' })
  @ApiResponse({ status: 200, description: 'Выводит страну по айди' })
  @Get('/countries/:id')
  getCountryById(@Param('id', ParseIntPipe) countryId: number) {
    return this.moviesService.send({ cmd: 'get-country-byId' }, countryId);
  }

  @UseGuards(RolesGuard)
  @RoleAccess(initRoles.ADMIN.value)
  @ApiOperation({ summary: 'Апдейт имени страны по айди' })
  @ApiResponse({ status: 201, description: 'Обновление стран' })
  @Put('/countries/:id')
  updateCountryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() country: UpdateCountryDto,
  ) {
    return this.moviesService.send(
      { cmd: 'update-country-byId' },
      { id: id, country: country },
    );
  }

  @UseGuards(RolesGuard)
  @RoleAccess(initRoles.ADMIN.value)
  @ApiOperation({ summary: 'Удаление страны по айди' })
  @Delete('/countries/:id')
  deleteCountriesById(@Param('id', ParseIntPipe) countryId: number) {
    return this.moviesService.send({ cmd: 'delete-country' }, countryId);
  }
}
