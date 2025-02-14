import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class CalculateCommissionDto {

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    amount: number;

    @IsOptional()
    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    commission?: number;
}