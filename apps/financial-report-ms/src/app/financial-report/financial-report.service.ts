import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetByDateRangeDto } from './dto/get-by-date-range.dto';

@Injectable()
export class FinancialReportService {

  constructor(private httpService: HttpService) { }

  async getIncomesByRangeDate(dateRange: GetByDateRangeDto) {
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    const currentYear = new Date().getFullYear();

    if (!startDate) {
      startDate = new Date(currentYear, 0, 1, 0, 0, 0);
    }

    if (!endDate) {
      endDate = new Date(currentYear, 11, 31, 23, 59, 59);
    }

    const incomes = await firstValueFrom(
      this.httpService.post('http://localhost:3000/api/incomes/range', {
        startDate: startDate,
        endDate: endDate
      })
    )
    return incomes.data;
  }

  async getExpensesByRangeDate(dateRange: GetByDateRangeDto) {
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    const currentYear = new Date().getFullYear();

    if (!startDate) {
      startDate = new Date(currentYear, 0, 1, 0, 0, 0);
    }

    if (!endDate) {
      endDate = new Date(currentYear, 11, 31, 23, 59, 59);
    }

    const expenses = await firstValueFrom(
      this.httpService.post('http://localhost:3000/api/expenses/range', {
        startDate: startDate,
        endDate: endDate
      })
    )
    return expenses.data;
  }

  async getFinanceData(dateRange: GetByDateRangeDto) {
    const incomes = await this.getIncomesByRangeDate(dateRange);
    const expenses = await this.getExpensesByRangeDate(dateRange);
    const incomesTotal = incomes.map((income: any) => Number(income.price)).reduce((a: number, b: number) => a + b, 0);
    const expensesTotal = expenses.map((expense: any) => Number(expense.price)).reduce((a: number, b: number) => a + b, 0);
    const balance = parseFloat((incomesTotal - expensesTotal).toFixed(2));

    const data = {
      ingresos: incomes,
      egresos: expenses,
      incomes: incomesTotal,
      expenses: expensesTotal,
      balance: balance
    }
    return data;
  }

  async getDataSummaryByDateRange(getByRangeDto: GetByDateRangeDto, movement: any) {
    const startDate = new Date(getByRangeDto.startDate);
    const endDate = new Date(getByRangeDto.endDate);
    endDate.setHours(23, 59, 59);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    console.log(movement);
    if ((endDate.getTime() - startDate.getTime()) <= oneWeek) {
      const dailyTotals = movement.reduce((acc: any, movement: any) => {
        let date: string;
        if (!movement.expenseDate) {
          date = new Date(movement.createdAt).toLocaleDateString('es-ES', { weekday: 'short' });
          console.log(date);
        }
        if (movement.expenseDate) {
          console.log(movement.expenseDate);
          const expenseDate = new Date(movement.expenseDate);
          expenseDate.setHours(expenseDate.getHours() + 6);
          console.log(expenseDate);
          date = expenseDate.toLocaleDateString('es-ES', { weekday: 'short' });
          console.log(date);
        }
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += Number(movement.price);
        return acc;
      }, {});

      const result = Object.keys(dailyTotals).map(day => ({
        day,
        total: dailyTotals[day]
      }));
      console.log(result);
      return result;
    } else {
      const monthlyTotals = movement.reduce((acc: any, movement: any) => {
        let date: string;
        if (!movement.expenseDate) {
          date = new Date(movement.createdAt).toLocaleDateString('es-ES', { month: 'short' });
        }
        if (movement.expenseDate) {
          console.log(movement.expenseDate);
          const expenseDate = new Date(movement.expenseDate);
          expenseDate.setHours(expenseDate.getHours() + 6);
          console.log(expenseDate);
          date = expenseDate.toLocaleDateString('es-ES', { month: 'short' });
          console.log(date);
        }
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += Number(movement.price);
        return acc;
      }, {});

      const result = Object.keys(monthlyTotals).map(month => ({
        month,
        total: monthlyTotals[month]
      }));
      console.log(result);
      return result;
    }
  }

  async getIncomesByDate(getByRangeDto: GetByDateRangeDto) {
    const incomes = await this.getIncomesByRangeDate(getByRangeDto);
    const data = this.getDataSummaryByDateRange(getByRangeDto, incomes);
    return data;
  }

  async getExpensesByDate(getByRangeDto: GetByDateRangeDto) {
    const expenses = await this.getExpensesByRangeDate(getByRangeDto);
    const data = this.getDataSummaryByDateRange(getByRangeDto, expenses);
    return data;
  }

  async getIncomesByCategories(getByRangeDto: GetByDateRangeDto) {
    const incomes = await this.getIncomesByRangeDate(getByRangeDto);
    const totalIncome = incomes.reduce((acc: number, income: any) => acc + Number(income.price), 0);
    console.log(totalIncome);
    console.log(incomes);
    const data = incomes.reduce((acc: any, income: any) => {
      if (!acc[income.product_category]) {
        acc[income.product_category] = 0;
      }
      acc[income.product_category] += Number(income.price);
      return acc;
    }, {});

    const result = Object.keys(data).map(category => ({
      label: category,
      value: parseFloat(((data[category] / totalIncome) * 100).toFixed(2))
    }));
    console.log(result);
    return result;
  }


  async getExpensesByCategories(getByRangeDto: GetByDateRangeDto) {
    const expenses = await this.getExpensesByRangeDate(getByRangeDto);
    const totalExpense = expenses.reduce((acc: number, expense: any) => acc + Number(expense.price), 0);

    const data = expenses.reduce((acc: any, expense: any) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += Number(expense.price);
      return acc;
    }, {});

    const result = Object.keys(data).map(category => ({
      label: category,
      value: parseFloat(((data[category] / totalExpense) * 100).toFixed(2))
    }));
    console.log(result);
    return result;
  }

}
