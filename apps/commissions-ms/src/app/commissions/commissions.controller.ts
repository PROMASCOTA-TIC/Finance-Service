import { Controller } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) { }

  @MessagePattern({ cmd: 'calculateEntrepreneurCommission' })
  calculateEntrepreneurCommission(@Payload() amount: number, commission: number) {
    return this.commissionsService.calculateEntrepreneurCommission(amount, commission);
  }

  @MessagePattern({ cmd: 'calculatePetOwnerCommission' })
  calculatePetOwnerCommission(@Payload() amount: number, commission: number) {
    return this.commissionsService.calculatePetOwnerCommission(amount, commission);
  }
}
