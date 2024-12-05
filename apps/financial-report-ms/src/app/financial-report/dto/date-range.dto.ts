import { IsDateString } from "class-validator";

export class DateRangeDto {
    
    @IsDateString()
    startDate?: Date;
    
    @IsDateString()
    endDate?: Date;
}
