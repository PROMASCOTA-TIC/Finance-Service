import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaxesService } from './taxes.service';

@Controller()
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @MessagePattern('create_calculated_tax')
  calculateMontlyTax() {
    return this.taxesService.calculateMonthlyTax();
  }

  @MessagePattern('find_all_taxes')
  findAll() {
    return this.taxesService.findAll();
  }

  @MessagePattern('find_one_tax')
  findOne(@Payload() id: string) {
    return this.taxesService.findOne(id);
  }
}
