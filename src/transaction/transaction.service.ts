import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionLog } from '../log/transaction-log.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(TransactionLog)
    private logRepo: Repository<TransactionLog>,
  ) {}

  // FASE 1: Votación
  async prepare(transactionId: string) {
    this.logger.log(`Recibido PREPARE para la tx: ${transactionId}`);
    try {
      const log = this.logRepo.create({ transactionId, state: 'PREPARED' });
      await this.logRepo.save(log);
      return { status: 'VOTE_COMMIT' };
    } catch (error) {
      this.logger.error(`Fallo al preparar la tx: ${transactionId}`, error);
      return { status: 'VOTE_ABORT' };
    }
  }

  // FASE 2: Decisión (Commit)
  async commit(transactionId: string) {
    this.logger.log(`Recibido GLOBAL_COMMIT para la tx: ${transactionId}`);
    await this.logRepo.update({ transactionId }, { state: 'COMMITTED' });
    return { status: 'ACK' }; // Acknowledge (Confirmación)
  }

  // FASE 2: Decisión (Rollback)
  async abort(transactionId: string) {
    this.logger.warn(`Recibido GLOBAL_ROLLBACK para la tx: ${transactionId}`);
    await this.logRepo.update({ transactionId }, { state: 'ABORTED' });
    return { status: 'ACK' };
  }
}
