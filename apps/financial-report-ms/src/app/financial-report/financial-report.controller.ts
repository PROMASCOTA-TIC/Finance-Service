import { Controller, ParseIntPipe } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service';
import { GetByDateRangeDto } from './dto/get-by-date-range.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('financial-report')
export class FinancialReportController {
  constructor(private readonly financialReportService: FinancialReportService) { }

  @MessagePattern('get_resumen')
  getFinanceData(@Payload() dateRange: GetByDateRangeDto) {
    return this.financialReportService.getFinanceData(dateRange);
  }

  @MessagePattern('get_incomes_by_date')
  getIncomesByDate(@Payload() getByRangeDto: GetByDateRangeDto) {
    return this.financialReportService.getIncomesByDate(getByRangeDto);
  }

  @MessagePattern('get_expenses_by_date')
  getExpensesByDate(@Payload() getByRangeDto: GetByDateRangeDto) {
    return this.financialReportService.getExpensesByDate(getByRangeDto);
  }

  @MessagePattern('get_incomes_by_categories')
  getIncomesByCategory(@Payload() getByRangeDto: GetByDateRangeDto) {
    return this.financialReportService.getIncomesByCategories(getByRangeDto);
  }

  @MessagePattern('get_expenses_by_categories')
  getExpensesByCategory(@Payload() getByRangeDto: GetByDateRangeDto) {
    return this.financialReportService.getExpensesByCategories(getByRangeDto);
  }

}
