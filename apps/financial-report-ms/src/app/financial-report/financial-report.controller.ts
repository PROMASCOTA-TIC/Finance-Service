import { Controller } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service';
import { DateRangeDto } from './dto/date-range.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('financial-report')
export class FinancialReportController {
  constructor(private readonly financialReportService: FinancialReportService) {}

  @MessagePattern('get_finance_data')
  getFinanceData(@Payload() dateRange: DateRangeDto) {
    return this.financialReportService.getFinanceData(dateRange);
  }
}
