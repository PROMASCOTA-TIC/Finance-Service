import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';
import { IsUUID } from 'class-validator';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
    
    @IsUUID()
    id: string;
}
