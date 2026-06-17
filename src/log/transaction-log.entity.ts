import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transaction_logs')
export class TransactionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // El ID global de la transacción que envía el coordinador
  @Column({ unique: true })
  transactionId: string;

  // Estado de la transacción en este nodo
  @Column()
  state: 'INIT' | 'PREPARED' | 'COMMITTED' | 'ABORTED';

  @CreateDateColumn()
  createdAt: Date;
}
