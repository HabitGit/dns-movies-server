import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersonsFilms } from './persons.staff.m2m.model';
import { Persons } from './persons.model';

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(PersonsFilms)
    private personsFilmsRepository: typeof PersonsFilms,
    @InjectModel(Persons) private personsRepository: typeof Persons,
  ) {}

  async getCardPersonById(id) {}

  // async getStaffByFilmId(id) {
  //   const actors = [];
  //   const staff = await this.personsFilmsRepository.findAll({
  //     where: { kinopoiskFilmId: id },
  //   });

  //   for (const personId of staff) {
  //     const person = await this.getPersonById(personId.personId);
  //     actors.push({
  //       personId: personId.personId,
  //       professionText: personId.professionText,
  //       professionKey: personId.professionKey,
  //       person: person,
  //     });
  //   }
  //
  //   return actors;
  // }

  async getPersonById(id) {
    return await this.personsRepository.findOne({ where: { personId: id } });
  }

  async saveStaff(staff) {
    return await this.personsFilmsRepository.create({
      filmId: staff.id,
      ...staff.item,
    });
  }

  async saveActor(actor: any) {
    let isActor = await this.personsRepository.findOne({
      where: { personId: actor.personId }
    });
    if ( !isActor ) {
      return await this.personsRepository.create(actor);
    }
    return isActor;
  }
}
