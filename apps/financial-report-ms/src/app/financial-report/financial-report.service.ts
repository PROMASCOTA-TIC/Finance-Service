import { HttpService } from '@nestjs/axios';
import { Injectable, Search } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetByDateRangeDto } from './dto/get-by-date-range.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FinancialReportService {

  constructor(private httpService: HttpService) { }

  async getSalesByRangeDate(dateRange: GetByDateRangeDto) {
    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;
    const currentYear = new Date().getFullYear();

    if (!startDate) {
      startDate = new Date(currentYear, 0, 1, 0, 0, 0);
    }

    if (!endDate) {
      endDate = new Date(currentYear, 11, 31, 23, 59, 59);
    }
    try{
      const sales = await firstValueFrom(
        this.httpService.post('http://localhost:3001/api/incomes/sales-date-range', {
          startDate: startDate,
          endDate: endDate
        })
      )
    return sales.data;
    }
    catch(error){
      throw new RpcException(error);
    }
  }

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
      this.httpService.post('http://localhost:3001/api/incomes/date-range', {
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
      this.httpService.post('http://localhost:3001/api/expenses/range', {
        startDate: startDate,
        endDate: endDate
      })
    )
    return expenses.data;
  }

  async getEntrepreneurName(entrepreneurId: string) {
    const entrepreneur = await firstValueFrom(
      this.httpService.get('http://localhost:3001/api/entrepreneur/' + entrepreneurId)
    )
    return entrepreneur.data;
  }

  async getProductsName(productId: string) {
    const product = await firstValueFrom(
      this.httpService.get('http://localhost:3001/api/products/' + productId)
    )
    return product.data;
  }

  async getFinanceData(dateRange: GetByDateRangeDto) {
    const incomes = await this.getIncomesByRangeDate(dateRange);
    const expenses = await this.getExpensesByRangeDate(dateRange);
    const sales = await this.getSalesByRangeDate(dateRange);
    const incomesTotal = await incomes
      .map((income: any) => Number(income.price))
      .reduce((a: number, b: number) => {
        const sum = a + b;
        return sum;
      }, 0);

    const expensesTotal = await expenses
      .map((expense: any) => Number(expense.price))
      .reduce((a: number, b: number) => {
        const sum = a + b;
        return sum;
      }, 0);
    const balance = parseFloat((incomesTotal - expensesTotal).toFixed(2));

    const incomesData = await Promise.all(incomes.map(async (income: any) => {
      // const entrepreneur = await this.getEntrepreneurName(income.entrepreneurId);
      return income = {
        id: income.id,
        userName: '', //entrepreneur.name,
        amount: Number(income.price),
        incomeDate: new Date(income.createdAt)
      };
    }));

    const expensesData = await Promise.all(expenses.map(async (expense: any) => {
      return expense = {
        id: expense.id,
        category: expense.category,
        description: expense.description,
        price: Number(expense.price),
        expenseDate: new Date(expense.expenseDate)
      };
    }));

    const salesData = await Promise.all(sales.map(async (sale: any) => {
      // const entrepreneur = await this.getEntrepreneurName(sale.entrepreneurId);
      // const product = await this.getProductsName(sale.productId);
      return sale = {
        id: sale.id,
        entrepreneurName:'', //entrepreneur.name,
        productName: '', // poner el nombre que se traiga product.name,
        productCategory: sale.productCategory, // poner la categoria que se traiga product.category.name,
        amount: Number(sale.amount),
        saleDate: new Date(sale.salesDate)
      };
    }));
    console.log(salesData);
    const data = {
      ingresos: incomesData,
      egresos: expensesData,
      ventas: salesData,
      incomes: incomesTotal.toFixed(2),
      expenses: expensesTotal.toFixed(2),
      balance: balance.toFixed(2)
    }
    return data;
  }

  async getDataSummaryByDateRange(getByRangeDto: GetByDateRangeDto, movement: any) {
    const startDate = new Date(getByRangeDto.startDate);
    const endDate = new Date(getByRangeDto.endDate);
    endDate.setHours(23, 59, 59);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if ((endDate.getTime() - startDate.getTime()) <= oneWeek) {
      const dailyTotals = movement.reduce((acc: any, movement: any) => {
        let date: string;
        if (!movement.expenseDate) {
          date = new Date(movement.createdAt).toLocaleDateString('es-ES', { weekday: 'short' });
        }
        if (movement.expenseDate) {
          const expenseDate = new Date(movement.expenseDate);
          expenseDate.setHours(expenseDate.getHours() + 6);
          date = expenseDate.toLocaleDateString('es-ES', { weekday: 'short' });
        }
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += Number(movement.price);
        return acc;
      }, {});

      const allDays = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
      const result = allDays.map(day => ({
        label: day,
        value: dailyTotals[day] ? dailyTotals[day].toFixed(2) : '0.00'
      }));
      return result;
    } else {
      const monthlyTotals = movement.reduce((acc: any, movement: any) => {
        let date: string;
        if (!movement.expenseDate) {
          date = new Date(movement.createdAt).toLocaleDateString('es-ES', { month: 'short' });
        }
        if (movement.expenseDate) {
          const expenseDate = new Date(movement.expenseDate);
          expenseDate.setHours(expenseDate.getHours() + 6);
          date = expenseDate.toLocaleDateString('es-ES', { month: 'short' });
        }
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += Number(movement.price);
        return acc;
      }, {});

      const allMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const result = allMonths.map(month => ({
        label: month,
        value: monthlyTotals[month] ? monthlyTotals[month].toFixed(2) : '0.00'
      }));
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
    const data = incomes.reduce((acc: any, income: any) => {
      if (!acc[income.category]) {
        acc[income.category] = 0;
      }
      acc[income.category] += Number(income.price);
      return acc;
    }, {});

    const result = Object.keys(data).map(category => ({
      label: category,
      value: parseFloat(((data[category] / totalIncome) * 100).toFixed(2))
    }));
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
    return result;
  }

  async getTotalIncomesByRangeDate(dateRange: GetByDateRangeDto) {
    const incomes = await this.getIncomesByRangeDate(dateRange);

    const incomesTotal = incomes
      .map((income: any) => Number(income.price))
      .reduce((a: number, b: number) => {
        const sum = a + b;
        return sum;
      }, 0);
    return incomesTotal.toFixed(2);
  }

  async getTotalExpensesByRangeDate(dateRange: GetByDateRangeDto) {
    const expenses = await this.getExpensesByRangeDate(dateRange);

    const expensesTotal = expenses
      .map((expense: any) => Number(expense.price))
      .reduce((a: number, b: number) => {
        const sum = a + b;
        return sum;
      }, 0);
    return expensesTotal.toFixed(2);
  }

  async getBalanceByRangeDate(dateRange: GetByDateRangeDto) {
    const incomesTotal = await this.getTotalIncomesByRangeDate(dateRange);
    const expensesTotal = await this.getTotalExpensesByRangeDate(dateRange);
    const balance = parseFloat((Number(incomesTotal) - Number(expensesTotal)).toFixed(2));
    return balance.toFixed(2);
  }
}