import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetByDateRangeDto } from './dto/get-income-by-range-';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @MessagePattern('create_expense')
  create(@Payload() createExpenseDto: CreateExpenseDto) {
    console.log('Mensaje recibido en create_expense:', createExpenseDto)
    return this.expensesService.create(createExpenseDto);
  }

  @MessagePattern('find_all_expenses')
  findAll() {
    return this.expensesService.findAll();
  }

  @MessagePattern('find_one_expense')
  findOne(@Payload('id') id: string) {
    console.log('Mensaje recibido en find_one_expense:', id)
    return this.expensesService.findOne(id);
  }

  @MessagePattern('update_expense')
  update(
    @Payload() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.expensesService.update(updateExpenseDto.id, updateExpenseDto);
  }

  @MessagePattern('delete_expense')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.remove(id);
  }

  @MessagePattern('get_expenses_by_date_range')
  getExpensesByDateRange(@Payload() getByDateRangeDto: GetByDateRangeDto) {
    return this.expensesService.findByDateRange(getByDateRangeDto);
  }
}
