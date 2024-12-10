import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transactions.dto';
import { IsUUID } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  
  @IsUUID()
  id: string;
}
