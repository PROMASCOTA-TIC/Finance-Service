import { Module } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { CommissionsController } from './commissions.controller';

@Module({
  imports: [],
  controllers: [CommissionsController],
  providers: [CommissionsService],
})
export class CommissionsModule {}
