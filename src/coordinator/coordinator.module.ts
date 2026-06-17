import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';

@Module({
  imports: [HttpModule],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {}
