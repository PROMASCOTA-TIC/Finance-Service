import { Injectable, Logger } from '@nestjs/common';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';

@Injectable()
export class CommissionsService {

    private readonly logger = new Logger(CommissionsService.name);

    calculateEntrepreneurCommission(calculateCommissionDto: CalculateCommissionDto) {
        const { amount, commission } = calculateCommissionDto;
        const totalPrice = amount * commission / 100;
        return totalPrice.toFixed(2);
    }

    calculatePetOwnerCommission(calculateCommissionDto: CalculateCommissionDto) {
        const { amount } = calculateCommissionDto;
        const totalPrice = amount * 0.06;
        return totalPrice.toFixed(2);
    }
}
