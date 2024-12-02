import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { v4 as UuidV4 } from 'uuid';
import { CreateIncomeDto } from './dto/create-income.dto';
import { Income } from './models/income.models';
import { InjectModel } from '@nestjs/sequelize';
import { GetByDateRangeDto } from './dto/get-income-by-range-';
import { Op } from 'sequelize';
import { NotFoundError } from 'rxjs';


@Injectable()
export class IncomesService implements OnModuleInit {
  constructor(
    @InjectModel(Income)
    private incomeModel: typeof Income,
  ) { }
  private readonly logger = new Logger('IncomesService');

  async onModuleInit() {
    this.logger.log('Initializing database connection...');
    try {
      await this.incomeModel.sequelize.authenticate();
      this.logger.log('Connection to the database has been established successfully.');
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error.message);
    }
  }

  async create(createIncomeDto: CreateIncomeDto) {
    //TODO: Conectar con el ms de productos para obtener la categoría del producto
    const newIncome = { id: UuidV4(), product_category: 'Alimento' ,...createIncomeDto };
    try {
      return await this.incomeModel.findByPk(newIncome.id);
    } catch (error) {
      this.logger.error('Error creating incomes:', error.message);
      throw new Error(`Error creating income: ${error.message}`);
    }
  }

  async findAll() {
    return await this.incomeModel.findAll().catch((error) => {
      this.logger.error('Error getting incomes:', error.message);
      throw new NotFoundException('Error getting incomes:', error.message);
    });
  }

  async findOne(id: string) {
    const income = await this.incomeModel.findByPk(id);
    if (!income) {
      this.logger.error(`Income with id ${id} not found`);
      throw new NotFoundException(`Income with id ${id} not found`);
    }
    return income;
  }

  async findByDateRange(getByDateRangeDto: GetByDateRangeDto) {
    return await this.incomeModel.findAll({    
      where: {
        income_date: {
          [Op.between]: [getByDateRangeDto.startDate, getByDateRangeDto.endDate]
        }
      }
    }).catch((error) => {
      this.logger.error('Error getting incomes:', error.message);
      throw new NotFoundException('Error getting incomes:', error.message);
    });
  }

}
