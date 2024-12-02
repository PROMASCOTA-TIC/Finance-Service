import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  // @Post()
  @MessagePattern({ cmd: 'create_expense' })
  create(@Payload() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_expenses' })
  findAll() {
    return this.expensesService.findAll();
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_expense' })
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.expensesService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_expense' })
  update(
    // @Param('id', ParseUUIDPipe) id: string,
    // @Body() updateExpenseDto: UpdateExpenseDto
    @Payload() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.expensesService.update(updateExpenseDto.id, updateExpenseDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_expense' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.remove(id);
  }
}
