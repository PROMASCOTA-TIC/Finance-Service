import { Controller } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';

@Controller()
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) { }

  @MessagePattern('calculate_entrepreneur_commission')
  calculateEntrepreneurCommission(@Payload() calculateCommissionDto: CalculateCommissionDto) {
    return this.commissionsService.calculateEntrepreneurCommission(calculateCommissionDto);
  }

  @MessagePattern('calculate_pet_owner_commission')
  calculatePetOwnerCommission(@Payload() calculateCommissionDto: CalculateCommissionDto) {
    return this.commissionsService.calculatePetOwnerCommission(calculateCommissionDto);
  }
}
