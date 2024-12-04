import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetByDateRangeDto } from './dto/get-income-by-range.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @MessagePattern('create_expense')
  create(@Payload() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @MessagePattern('find_all_expenses')
  findAll() {
    return this.expensesService.findAll();
  }

  @MessagePattern('update_expense')
  update(
    @Payload() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.expensesService.update(updateExpenseDto.id, updateExpenseDto);
  }

  @MessagePattern('delete_expense')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.expensesService.remove(id);
  }

  @MessagePattern('get_expenses_by_date_range')
  getExpensesByDateRange(@Payload() getByDateRangeDto: GetByDateRangeDto) {
    return this.expensesService.findByDateRange(getByDateRangeDto);
  }
}
