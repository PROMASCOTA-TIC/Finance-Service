import { IsDateString } from "class-validator";

export class GetByDateRangeDto {
    
    @IsDateString()
    startDate: Date;
    
    @IsDateString()
    endDate: Date;
}
