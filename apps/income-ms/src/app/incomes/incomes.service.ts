import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { v4 as UuidV4 } from 'uuid';
import { CreateIncomeDto } from './dto/create-income.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GetByDateRangeDto } from './dto/get-income-by-range.dto';
import { Op } from 'sequelize';
import { Cron } from '@nestjs/schedule';
import { Income } from './models/income.model';
import { ProductSale } from './models/productSale.models';

@Injectable()
export class IncomesService implements OnModuleInit {
  constructor(
    @InjectModel(Income)
    private incomeModel: typeof Income,
    @InjectModel(ProductSale)
    private productSaleModel: typeof ProductSale
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

  async createSaleByProduct(createIncomeDto: CreateIncomeDto) {
    //TODO: Conectar con el ms de productos para obtener la categoría del producto
    //TODO: Coordinar coneccion con pago (Jackson)
    const newProductSale = { id: UuidV4(), productCategory: 'Alimento', ...createIncomeDto };
    try {
      return await this.productSaleModel.create(newProductSale);
    } catch (error) {
      this.logger.error('Error creating incomes:', error.message);
      throw new Error(`Error creating income: ${error.message}`);
    }
  }

  @Cron('0 0 * * 1')
  async createIncome(createIncomeDto: CreateIncomeDto) {
    //TODO: Coordinar conexión con venta para almacenar la comisión que se le cobra al comprador (Jackson)
    //TODO: Coordinar conexión con emprendedor para obtener sus ventas en la semana
    const newIncome = { id: UuidV4(), ...createIncomeDto };
    try {
      return await this.incomeModel.create(newIncome);
    } catch (error) {
      this.logger.error('Error creating incomes:', error.message);
      throw new Error(`Error creating income: ${error.message}`);
    }
  }

  async findAll() {
    return await this.productSaleModel.findAll().catch((error) => {
      this.logger.error('Error getting incomes:', error.message);
      throw new NotFoundException('Error getting incomes:', error.message);
    });
  }

  async findOne(id: string) {
    const income = await this.productSaleModel.findByPk(id);
    if (!income) {
      this.logger.error(`Income with id ${id} not found`);
      throw new NotFoundException(`Income with id ${id} not found`);
    }
    return income;
  }

  async findByDateRange(getByDateRangeDto: GetByDateRangeDto) {
    const { startDate, endDate } = getByDateRangeDto;
    const startDateTemp = new Date(startDate);
    const endDateTemp = new Date(endDate);
    endDateTemp.setHours(23, 59, 59, 999);
    startDateTemp.setHours(0, 0, 0, 0);
    return await this.incomeModel.findAll({    
      where: {
        CREATED_AT: {
          [Op.between]: [getByDateRangeDto.startDate, endDate]
        }
      }
    }).catch((error) => {
      this.logger.error('Error getting incomes:', error.message);
      throw new NotFoundException('Error getting incomes:', error.message);
    });
  }
}
