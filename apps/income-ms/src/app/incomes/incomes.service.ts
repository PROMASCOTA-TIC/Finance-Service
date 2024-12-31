import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { v4 as UuidV4 } from 'uuid';
import { CreateIncomeDto } from './dto/create-income.dto';
import { InjectModel } from '@nestjs/sequelize';
import { GetByDateRangeDto } from './dto/get-income-by-range.dto';
import { Op } from 'sequelize';
import { Income } from './models/income.model';
import { ProductSale } from './models/productSale.models';
import axios from 'axios';

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

  
  async createIncome(createIncomeDto: CreateIncomeDto) {
    //TODO: Coordinar conexión con venta para almacenar la comisión que se le cobra al comprador (Jackson)
    //TODO: Coordinar conexión con ventas para obtener todas las ventas en la semana de un emprendedor
    const newIncome = { id: UuidV4(), ...createIncomeDto };
    try {
      return await this.incomeModel.create(newIncome);
    } catch (error) {
      this.logger.error('Error creating incomes:', error.message);
      throw new Error(`Error creating income: ${error.message}`);
    }
  }

  async findIncomeByDateRange(getByDateRangeDto: GetByDateRangeDto) {
    const { startDate, endDate } = getByDateRangeDto;
    const startDateTemp = new Date(startDate);
    const endDateTemp = new Date(endDate);
    endDateTemp.setHours(23, 59, 59, 999);
    startDateTemp.setHours(0, 0, 0, 0);
    return await this.incomeModel.findAll({
      attributes: ['id', 'userId', 'price', 'category', 'createdAt'],
      where: {
        CREATED_AT: {
          [Op.between]: [startDateTemp, endDateTemp]
        }
      }
    }).catch((error) => {
      this.logger.error('Error getting incomes:', error.message);
      throw new NotFoundException('Error getting incomes:', error.message);
    });
  }

  async findSalesByDateRange(getByDateRangeDto: GetByDateRangeDto) {
    const { startDate, endDate } = getByDateRangeDto;
    const startDateTemp = new Date(startDate);
    const endDateTemp = new Date(endDate);
    endDateTemp.setHours(23, 59, 59, 999);
    startDateTemp.setHours(0, 0, 0, 0);
    return await this.productSaleModel.findAll({
      attributes: ['id', 'salesDate', 'entrepreneurId', 'productId', 'productCategory', 'amount'],
      where: {
        SALES_DATE: {
          [Op.between]: [startDateTemp, endDateTemp]
        }
      }
    }).catch((error) => {
      this.logger.error('Error getting salessssssssssss:', error.message);
      throw new NotFoundException('Error getting salessssssssssssssss:', error.message);
    });
  }
  
  async createSaleByProduct(createIncomeDto: CreateIncomeDto) {
    //TODO: Coordinar conexion con pago (Jackson) VER QUE DATOS RECIBE
    try {
      const response = await axios.get('http://localhost:3001/api/products/' + createIncomeDto.productId);
      const product = response.data;
      const newProductSale = { id: UuidV4(), productCategory: product.category.name, ...createIncomeDto };
      return await this.productSaleModel.create(newProductSale);
    } catch (error) {
      this.logger.error('Error creating incomes:', error.message);
      throw new Error(`Error creating income: ${error.message}`);
    }
  }

  async getWeeklySales(entrepreneurId: string) {
    //TODO: Coordinar conexión con ventas (JSON) para obtener sus ventas en la semana
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)));
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date();
    lastDayOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1) + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    const weeklySales = await this.productSaleModel.findAll({
      attributes: ['id', 'salesDate', 'entrepreneurId', 'productId', 'productCategory', 'amount'],
      where: {
        ENTREPRENEUR_ID: entrepreneurId,
        CREATED_AT: {
          [Op.between]: [firstDayOfWeek, lastDayOfWeek]
        }
      }
    });

    if (!weeklySales) {
      this.logger.error('Error getting weekly sales');
      throw new NotFoundException('Error getting weekly sales');
    }
    return weeklySales;
  }

  async findAll() {
    return await this.productSaleModel.findAll().catch((error) => {
      this.logger.error('Error getting sales:', error.message);
      throw new NotFoundException('Error getting sales:', error.message);
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
}
