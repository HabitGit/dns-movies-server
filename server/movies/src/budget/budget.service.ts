import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Budget } from './budget.model';
import { BudgetFilms } from './budget.m2m.model';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(BudgetFilms) private budgetFilmsRepository: typeof BudgetFilms,
    @InjectModel(Budget) private budgetRepository: typeof Budget,
  ) {}

  // async getBudgetByFilmId(kinopoiskId: number) {
  //   return await this.budgetFilmsRepository.findAll({
  //     where: { kinopoiskFilmId: kinopoiskId },
  //   });
  // }

  async getBudgetById(budgetId: number) {
    return await this.budgetRepository.findOne({ where: { id: budgetId } });
  }

  async createBudget(budget) {
    let isBudget = await this.budgetRepository.findOne({where: {filmId: budget.id} });
    if ( !isBudget ) {
      return await this.budgetRepository.create(budget.budget);
    }
    return isBudget;
  }
}
