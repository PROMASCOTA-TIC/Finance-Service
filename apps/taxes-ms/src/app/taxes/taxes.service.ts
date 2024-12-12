import { Injectable, Logger } from '@nestjs/common';
import { Tax } from './models/tax.model';
import { UUIDV4 } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TaxesService {
  constructor(
    @InjectModel(Tax)
    private readonly taxModel: typeof Tax,
    private readonly logger: Logger,
    private httpService: HttpService
  ) { }

  async calculateTotalCommissions() {
    const date = new Date();

    const endDate = new Date();
    endDate.setMonth(date.getMonth());
    endDate.setDate(1);
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date(endDate.getFullYear(), date.getMonth() - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    if (date.getMonth() === 0) {
      startDate.setFullYear(date.getFullYear() - 1);
      startDate.setMonth(11);
    }

    const incomes = await firstValueFrom(
      this.httpService.post('http://localhost:3000/api/incomes/range', {
        startDate: startDate,
        endDate: endDate
      })
    )

    const totalCommissions = incomes.data.reduce((acc: number, income: any) => acc + Number(income.amount), 0);

    return totalCommissions;
  }

  @Cron('0 0 1 * *')
  async calculateMonthlyTax() {
    const totalCommissions = await this.calculateTotalCommissions();
    const ivaCalculated = totalCommissions * 0.15;
    const newTax = await this.create(totalCommissions, ivaCalculated);
    return newTax;
  }

  async create(totalCommissions: number, ivaCalculated: number) {
    const taxDate = new Date();
    taxDate.setHours(1, 59, 59, 999);
    taxDate.setMonth(taxDate.getMonth() - 1);

    const netProfit = totalCommissions - ivaCalculated;
    
    const newTax = {
      id: UUIDV4(),
      taxDate: taxDate,
      totalCommissions: totalCommissions.toFixed(2),
      ivaCalculated: ivaCalculated.toFixed(2),
      netProfit: netProfit.toFixed(2),
    };
    try {
      return await this.taxModel.create(newTax);
    } catch (error) {
      this.logger.error('Error in monthly tax calculation:', error.message);
      throw new Error(`Error in monthly tax calculation: ${error.message}`);
    }
  }

  async findAll() {
    return this.taxModel.findAll().catch((error) => {
      this.logger.error('Error getting all taxes:', error.message);
      throw new Error(`Error getting all taxes: ${error.message}`);
    });
  }

  async findOne(id: string) {
    return this.taxModel.findByPk(id).catch((error) => {
      this.logger.error('Error getting tax:', error.message);
      throw new Error(`Error getting tax: ${error.message}`);
    });
  }
}
