import { Controller, Post, Body } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';

@Controller('coordinator')
export class CoordinatorController {
  constructor(private readonly coordinatorService: CoordinatorService) {}

  @Post('execute')
  executeTransaction(@Body('transactionId') transactionId: string) {
    return this.coordinatorService.executeGlobalTransaction(transactionId);
  }
}
