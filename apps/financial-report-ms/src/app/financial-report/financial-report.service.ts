import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DateRangeDto } from './dto/date-range.dto';

@Injectable()
export class FinancialReportService {

  constructor(private httpService: HttpService) { }

  async getFinanceData(dateRange: DateRangeDto) {
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    const currentYear = new Date().getFullYear();

    if (!startDate) {
      startDate = new Date(currentYear, 0, 1, 0, 0, 0);
    }

    if (!endDate) {
      endDate = new Date(currentYear, 11, 31, 23, 59, 59);
    }

    const respIngresos = await firstValueFrom(
      this.httpService.post('http://localhost:3000/api/incomes/range', {
        startDate: startDate,
        endDate: endDate
      })
    )
    const respEgresos = await firstValueFrom(
      this.httpService.post('http://localhost:3000/api/expenses/range', {
        startDate: startDate,
        endDate: endDate
      })
    )
    const incomesTotal = respIngresos.data.map((income: any) => Number(income.price)).reduce((a: number, b: number) => a + b, 0);
    const expensesTotal = respEgresos.data.map((expense: any) => Number(expense.price)).reduce((a: number, b: number) => a + b, 0);
    const balance = parseFloat((incomesTotal - expensesTotal).toFixed(2));

    const data = {
      ingresos: respIngresos.data,
      egresos: respEgresos.data,
      incomes: incomesTotal,
      expenses: expensesTotal,
      balance: balance
    }
    return data;

  }
}
