import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('prepare')
  prepare(@Body('transactionId') transactionId: string) {
    return this.transactionService.prepare(transactionId);
  }

  @Post('commit')
  commit(@Body('transactionId') transactionId: string) {
    return this.transactionService.commit(transactionId);
  }

  @Post('abort')
  abort(@Body('transactionId') transactionId: string) {
    return this.transactionService.abort(transactionId);
  }
}
