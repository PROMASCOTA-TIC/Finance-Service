import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTransferDto {
  
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  comment: string;

}
