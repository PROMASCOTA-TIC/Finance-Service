import { Injectable, Logger } from '@nestjs/common';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';

@Injectable()
export class CommissionsService {

    private readonly logger = new Logger(CommissionsService.name);

    calculateEntrepreneurCommission(calculateCommissionDto: CalculateCommissionDto) {
        const { amount, commission } = calculateCommissionDto;
        console.log(`Calculating entrepreneur commission for amount: ${calculateCommissionDto}`);
        const totalPrice = amount * commission;
        return totalPrice.toFixed(2);
    }

    calculatePetOwnerCommission(calculateCommissionDto: CalculateCommissionDto) {
        const { amount, commission } = calculateCommissionDto;
        console.log(`Calculating affiliate commission for amount: ${calculateCommissionDto}`);
        const totalPrice = amount * commission;
        return totalPrice.toFixed(2);
    }
}
