import { Module } from '@nestjs/common';
import { CommissionsModule } from './commissions/commissions.module';

@Module({
  imports: [CommissionsModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
