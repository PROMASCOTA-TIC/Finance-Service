import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommissionsService {

    private readonly logger = new Logger(CommissionsService.name);

    calculateEntrepreneurCommission(amount: number, commission: number) {
        console.log(`Calculating entrepreneur commission for amount: ${amount * commission}`);
        const totalPrice = amount * commission;
        return totalPrice.toFixed(2);
    }

    calculatePetOwnerCommission(amount: number, commission: number) {
        console.log(`Calculating affiliate commission for amount: ${amount * commission}`);
        const totalPrice = amount * commission;
        return totalPrice.toFixed(2);
    }
}
