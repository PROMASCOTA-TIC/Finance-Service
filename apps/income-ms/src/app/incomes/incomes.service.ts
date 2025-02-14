import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { v4 as UuidV4 } from 'uuid';
import { Op } from 'sequelize';
import axios from 'axios';
import { GetByDateRangeDto } from './dto/get-income-by-range.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ProductSale } from './models/productSale.model';
import { Income } from './models/income.model';
import { URL_BASE } from '../../config/service';

@Injectable()
export class IncomesService implements OnModuleInit {
  constructor(
    @InjectModel(Income)
    private incomeModel: typeof Income,
    @InjectModel(ProductSale)
    private productSaleModel: typeof ProductSale,
    private httpService: HttpService
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
      attributes: ['id', 'userId', 'commissionValue', 'category', 'createdAt'],
      where: {
        CREATED_AT: {
          [Op.between]: [startDateTemp, endDateTemp]
        }
      },
      order: [['createdAt', 'DESC']]
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
    const sales = await this.productSaleModel.findAll({
      attributes: ['id', 'salesDate', 'entrepreneurId', 'productId', 'productCategory', 'amount'],
      where: {
        SALES_DATE: {
          [Op.between]: [startDateTemp, endDateTemp]
        }
      },
      order: [['salesDate', 'DESC']]
    }).catch((error) => {
      this.logger.error('Error getting sales:', error.message);
      throw new NotFoundException('Error getting sale:', error.message);
    });
    const salesMod = await Promise.all(sales.map(async (sale) => {
      const entrepreneur = await this.getEntrepreneurName(sale.entrepreneurId.toString());
      const product = await this.getProductsName(sale.productId.toString());
      const aux = {
        id: sale.id,
        salesDate: sale.salesDate,
        entrepreneurName: entrepreneur.name,
        productName: product.name,
        productCategory: sale.productCategory,
        amount: sale.amount
      }
      return aux;
    }));
    return salesMod;
  }

  async createSaleByProduct(createSaleDto: { entrepreneurId: string, productId: string, salesDate: string, amount: number }) {
    //TODO: Coordinar conexion con pago (Jackson) VER QUE DATOS RECIBE
    try {
      const response = await axios.get(`${URL_BASE}products/` + createSaleDto.productId);
      const product = response.data;
      const newProductSale = {
        id: UuidV4(),
        productCategory: product.category.name,
        salesDate: new Date(createSaleDto.salesDate),
        entrepreneurId: createSaleDto.entrepreneurId,
        amount: createSaleDto.amount,
        productId: createSaleDto.productId,
      };
      return await this.productSaleModel.create(newProductSale);
    } catch (error) {
      this.logger.error('Error creating sale:', error.message);
      throw new Error(`Error creating sale: ${error.message}`);
    }
  }

  async getWeeklySales(entrepreneurId: string) {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - (currentDate.getUTCDay() === 0 ? 6 : currentDate.getUTCDay() - 1)));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 6);
    firstDayOfWeek.setUTCHours(0, 0, 0, 0);
    lastDayOfWeek.setUTCHours(23, 59, 59, 999);
    const weeklySales = await this.productSaleModel.findAll({
      attributes: ['id', 'salesDate', 'entrepreneurId', 'productId', 'productCategory', 'amount'],
      where: {
        ENTREPRENEUR_ID: entrepreneurId,
        SALES_DATE: {
          [Op.between]: [firstDayOfWeek, lastDayOfWeek]
        },
      },
      order: [['salesDate', 'DESC']]
    });

    if (!weeklySales) {
      this.logger.error('Error getting weekly sales');
      throw new NotFoundException('Error getting weekly sales');
    }
    return weeklySales;
  }

  async findAll() {
    return await this.productSaleModel.findAll({
      order: [['createdAt', 'DESC']]
    }).catch((error) => {
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

  async getEntrepreneurName(entrepreneurId: string) {
    const entrepreneur = await firstValueFrom(
      this.httpService.get(`${URL_BASE}users/entrepreneurs/` + entrepreneurId)
    )
    return entrepreneur.data;
  }

  async getProductsName(productId: string) {
    const product = await firstValueFrom(
      this.httpService.get(`${URL_BASE}products/` + productId)
    )
    return product.data;
  }
}
