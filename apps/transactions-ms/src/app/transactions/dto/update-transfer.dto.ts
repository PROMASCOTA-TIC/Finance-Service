import { IsString, IsUUID } from 'class-validator';

export class UpdateTransferDto {
  
  @IsUUID()
  id: string;

  @IsString()
  state: string;

  @IsString()
  observation: string;

}
