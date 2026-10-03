import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'decimal' })
  total!: number

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
  transactionDate!: Date

  @OneToMany(() => TransactionContents, (transaction) => transaction.transaction)
  contens!: TransactionContents[]
}

@Entity()
export class TransactionContents {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  quantity!: number

  @Column('decimal')
  price!: number

  @ManyToOne(() => Product, (product) => product.id, {eager: true})
  product!: Product

  @ManyToOne(() => Transaction,  (transaction) => transaction.contens)
  transaction!: Transaction
}
