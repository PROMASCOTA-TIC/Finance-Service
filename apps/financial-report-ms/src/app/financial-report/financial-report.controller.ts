import { Body, Controller, Get } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('financial-report')
export class FinancialReportController {
  constructor(private readonly financialReportService: FinancialReportService) {}

  @Get('data')
  getFinanceData(@Body() dateRange: DateRangeDto) {
    console.log('Getting finance data');
    return this.financialReportService.getFinanceData(dateRange);
  }
}
