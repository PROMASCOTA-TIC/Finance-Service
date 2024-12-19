import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class CalculateCommissionDto {

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    amount: number;

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    commission: number;
}