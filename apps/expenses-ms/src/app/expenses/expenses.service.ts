import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { v4 as UuidV4 } from 'uuid';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './models/expense.model';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class ExpensesService implements OnModuleInit {
  constructor(
    @InjectModel(Expense)
    private expense: typeof Expense,
  ) { }

  private readonly logger = new Logger(ExpensesService.name);

  async onModuleInit() {
    try {
      await this.expense.sequelize.authenticate();
      this.logger.log('Connection to the Oracle database is successful.')
    } catch (error) {
      this.logger.error(`Failed to connect to the Oracle database: ${error.message}`)
    }

    this.runMigrations();
  }

  async runMigrations() {
    try {
      await this.expense.sequelize.sync();

      this.logger.log('Migrations applied succesfully');
    } catch (error) {
      this.logger.error('Error applying migrations:', error);
    }
  }

  create(createExpenseDto: CreateExpenseDto) {
    return this.expense.create({
      id: UuidV4(),
      ...createExpenseDto
    }).catch(error => { throw new Error(error.message) });
  }

  async findAll() {
    return await this.expense.findAll();
  }

  async findOne(id: string) {
    const expense = await this.expense.findByPk(id);
    if(!expense){
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {

    const { id: _, ...data } = updateExpenseDto;

    await this.findOne(id);
    return this.expense.update(data, { where: { id } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.expense.destroy({ where: { id } });
  }
}
