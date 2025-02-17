import { Type } from "class-transformer"
import { IsDateString, IsNumber, IsUUID, Min } from "class-validator"

export class CreateSaleDto {

    @IsUUID()
    entrepreneurId: string

    @IsUUID()
    productId: string

    @IsDateString()
    salesDate: string

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    amount: number
}
