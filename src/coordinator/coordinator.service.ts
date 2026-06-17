import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoordinatorService {
  private readonly logger = new Logger(CoordinatorService.name);
  private participantUrls: string[];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    // Leemos las URLs del .env separadas por coma. Si no hay, usamos localhost.
    const urls = this.configService.get<string>('PARTICIPANTS') || 'http://localhost:3000';
    this.participantUrls = urls.split(',');
  }

  async executeGlobalTransaction(transactionId: string) {
    this.logger.log(`[2PC INICIO] Transacción global: ${transactionId}`);
    let allPrepared = true;

    // FASE 1: PREPARE
    for (const url of this.participantUrls) {
      try {
        const response = await firstValueFrom(
          this.httpService.post<any>(`${url}/transaction/prepare`, { transactionId })
        );
        if (response.data.status !== 'VOTE_COMMIT') {
          this.logger.warn(`El nodo ${url} votó ABORT.`);
          allPrepared = false;
          break;
        }
      } catch (error) {
        this.logger.error(`Fallo de red al contactar nodo ${url} en Fase 1`);
        allPrepared = false;
        break;
      }
    }

    // FASE 2: COMMIT o ROLLBACK
    const phase2Endpoint = allPrepared ? 'commit' : 'abort';
    this.logger.log(`[2PC DECISIÓN] Ejecutando GLOBAL ${phase2Endpoint.toUpperCase()}.`);

    for (const url of this.participantUrls) {
      try {
        await firstValueFrom(
          this.httpService.post<any>(`${url}/transaction/${phase2Endpoint}`, { transactionId })
        );
      } catch (error) {
        this.logger.error(`Error crítico en Fase 2 (${phase2Endpoint}) para nodo ${url}`);
      }
    }

    return {
      transactionId,
      status: allPrepared ? 'GLOBAL_COMMIT_SUCCESS' : 'GLOBAL_ROLLBACK_EXECUTED',
    };
  }
}
