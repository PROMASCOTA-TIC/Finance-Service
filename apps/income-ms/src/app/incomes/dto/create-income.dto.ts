import { Type } from "class-transformer"
import { IsDateString, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class CreateIncomeDto {

    @IsUUID()
    entrepreneur_id: string

    @IsUUID()
    product_id: string

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    price: number
}
