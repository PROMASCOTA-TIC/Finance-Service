import { Type } from "class-transformer"
import { IsDate, IsDateString, IsNumber, IsString, Min } from "class-validator"

export class CreateExpenseDto {

    @IsString()
    category: string

    @IsString()
    description: string

    @IsDateString()
    expenseDate: Date

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    price: number
}
