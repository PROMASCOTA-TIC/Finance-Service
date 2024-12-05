import { Module } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service';
import { FinancialReportController } from './financial-report.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [FinancialReportController],
  providers: [FinancialReportService],
})
export class FinancialReportModule {}
