import { Injectable, Logger } from '@nestjs/common';
import { Tax } from './models/tax.model';
import { UUIDV4 } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { URL_BASE } from '../../config';

@Injectable()
export class TaxesService {
  constructor(
    @InjectModel(Tax)
    private readonly taxModel: typeof Tax,
    private httpService: HttpService
  ) { }

  private readonly logger: Logger = new Logger(TaxesService.name);

  async calculateTotalCommissions() {
    const date = new Date();
    const endDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
    const startDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - 1, 1, 0, 0, 0, 0));
    if (date.getUTCMonth() === 0) {
      startDate.setUTCFullYear(date.getUTCFullYear() - 1);
      startDate.setUTCMonth(11);
    }
    const incomes = await firstValueFrom(
      this.httpService.post(`${URL_BASE}incomes/date-range`, {
        startDate: startDate,
        endDate: endDate
      })
    )
    const totalCommissions = incomes.data.reduce((acc: number, income: any) => acc + Number(income.commissionValue), 0);
    return totalCommissions;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_MINUTE)
  async calculateMonthlyTax() {
    const totalCommissions = await this.calculateTotalCommissions();
    const ivaCalculated = totalCommissions * 0.15;
    const newTax = await this.create(totalCommissions, ivaCalculated);
    return newTax;
  }

  async create(totalCommissions: number, ivaCalculated: number) {
    const taxDate = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1, 1, 59, 59, 999));
    const netProfit = totalCommissions - ivaCalculated;
    const newTax = {
      taxDate: taxDate,
      totalCommissions: totalCommissions.toFixed(2),
      ivaCalculated: ivaCalculated.toFixed(2),
      netProfit: netProfit.toFixed(2),
    };
    try {
      const tax = await this.taxModel.create(newTax);
      return "Tax created successfully";
    } catch (error) {
      this.logger.error('Error in monthly tax calculation:', error.message);
      throw new Error(`Error in monthly tax calculation: ${error.message}`);
    }
  }

  async findAll() {
    const taxes = this.taxModel.findAll({
      order: [['taxDate', 'DESC']]
    }).catch((error) => {
      this.logger.error('Error getting all taxes:', error.message);
      throw new Error(`Error getting all taxes: ${error.message}`);
    });
    return taxes;
  }

  async findOne(id: string) {
    return this.taxModel.findByPk(id).catch((error) => {
      this.logger.error('Error getting tax:', error.message);
      throw new Error(`Error getting tax: ${error.message}`);
    });
  }
}
