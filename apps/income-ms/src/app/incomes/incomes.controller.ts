import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { GetByDateRangeDto } from './dto/get-income-by-range.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @MessagePattern('create_income')
  create(@Payload() createIncomeDto: CreateIncomeDto) {
    console.log('createIncomeDto', createIncomeDto);
    return this.incomesService.create(createIncomeDto);
  }

  @MessagePattern('find_all_incomes')
  findAll() {
    return this.incomesService.findAll();
  }

  @MessagePattern('find_income_by_date_range')
  findByDateRange(@Payload() getByDateRangeDto: GetByDateRangeDto) {
    return this.incomesService.findByDateRange(getByDateRangeDto);
  }
}
