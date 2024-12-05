import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { v4 as UuidV4 } from 'uuid';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './models/expense.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GetByDateRangeDto } from './dto/get-income-by-range.dto';


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
  }

  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const expenseDate = new Date(createExpenseDto.expenseDate);
      expenseDate.setHours(1,0,0,0)
      return await this.expense.create({
        id: UuidV4(),
        expenseDate: expenseDate,
        ...createExpenseDto
      });
    } catch (error) {
      this.logger.error('Error creating expense:', error.message);
      throw new Error(error.message);
    }
  }

  async findAll() {
    return await this.expense.findAll().catch((error) => {
      this.logger.error('Error getting expenses:', error.message);
      throw new NotFoundException('Error getting expenses:', error.message);
    });
  }

  async findOne(id: string) {
    const expense = await this.expense.findByPk(id);
    if (!expense) {
      this.logger.error(`Expense with id ${id} not found`);
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const { id: _, ...data } = updateExpenseDto;
    await this.findOne(id);
    return this.expense.update(data, { where: { id } }).catch((error) => {
      this.logger.error('Error updating expense:', error.message);
      throw new Error(error.message);
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.expense.destroy({ where: { id } }).catch((error) => {
      this.logger.error('Error deleting expense:', error.message);
      throw new Error(error.message);
    });
  }

  async findByDateRange(getByDateRangeDto: GetByDateRangeDto) {
    const endDate = new Date(getByDateRangeDto.endDate);
    endDate.setHours(23,59,59,999);
    return await this.expense.findAll({
      where: {
        EXPENSE_DATE: {
          [Op.between]: [getByDateRangeDto.startDate, endDate]
        }
      }
    }).catch((error) => {
      this.logger.error('Error getting incomes:', error.message);
      throw new NotFoundException('Error getting incomes:', error.message);
    });
  }

}