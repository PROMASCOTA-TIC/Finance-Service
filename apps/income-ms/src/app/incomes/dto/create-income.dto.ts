import { Type } from "class-transformer"
import { IsDateString, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class CreateIncomeDto {

    @IsUUID()
    entrepreneurId: string

    @IsUUID()
    productId: string

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    price: number
}
