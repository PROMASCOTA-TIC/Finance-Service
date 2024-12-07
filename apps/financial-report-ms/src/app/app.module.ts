import { Module } from '@nestjs/common';
import { FinancialReportModule } from './financial-report/financial-report.module';

@Module({
  imports: [FinancialReportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
