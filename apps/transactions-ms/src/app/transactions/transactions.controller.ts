import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transactions.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern('create_entrepreneur_payment')
  createEntrepreneurPayment(@Payload() creatTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createEntrepreneurPayment(creatTransactionDto);
  }

  @MessagePattern('find_all_entrepreneur_payments')
  findAllEntrepreneurPayments() {
    return this.transactionsService.findAllEntrepreneurPayment();
  }

  @MessagePattern('find_one_entrepreneur_payment')
  findOneEntrepreneurPayment(@Payload() id: string) {
    return this.transactionsService.findOneEntrepreneurPayment(id);
  }

  @MessagePattern('update_entrepreneur_payment')
  updateEntrepreneurPayment(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.updateEntrepreneurPayment(updateTransactionDto.id, updateTransactionDto);
  }

  @MessagePattern('validate_transfer')
  validateTransfer(@Payload() id: string, updateTransferDto: UpdateTransferDto) {
    return this.transactionsService.validateTransfer(id, updateTransferDto);
  }

}
