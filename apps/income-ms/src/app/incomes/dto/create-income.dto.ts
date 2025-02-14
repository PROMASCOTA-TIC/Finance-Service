import { Type } from "class-transformer"
import { IsIn, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class CreateIncomeDto {

    @IsUUID()
    userId: string

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    commissionValue: number  

    @IsString()
    @IsIn(['Entrepreneur', 'PetOwner'])
    category: string
}
