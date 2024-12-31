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
    return this.incomesService.createIncome(createIncomeDto);
  }

  @MessagePattern('find_all_sales')
  findAll() {
    return this.incomesService.findAll();
  }

  @MessagePattern('find_sales_by_date_range')
  findSalesByDateRange(@Payload() getByDateRangeDto: GetByDateRangeDto) {
    return this.incomesService.findSalesByDateRange(getByDateRangeDto);
  }


  @MessagePattern('find_income_by_date_range')
  findIncomeByDateRange(@Payload() getByDateRangeDto: GetByDateRangeDto) {
    return this.incomesService.findIncomeByDateRange(getByDateRangeDto);
  }

  @MessagePattern('find_income_by_id')
  findOne(@Payload() id: string) {
    return this.incomesService.findOne(id);
  }

  @MessagePattern('get_weekly_sales')
  getWeeklySales(@Payload() entrepreneurId: string) {
    return this.incomesService.getWeeklySales(entrepreneurId);
  }

  @MessagePattern('create_sale_by_product')
  //TODO: Coordinar conexion con pago (Jackson)
  createSaleByProduct(@Payload() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.createSaleByProduct(createIncomeDto);
  }
}
