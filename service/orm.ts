import { ConnectionOptions, Column, Entity } from 'typeorm'

@Entity('invoice', { schema: 'monero_merchant' })
export class Invoice {
  @Column('varchar', { primary: true, name: 'id', length: 16 })
  id: string

  @Column('varchar', {
    name: 'amount',
    nullable: false,
    length: 100,
  })
  amount: string | null

  @Column('varchar', {
    name: 'status',
    nullable: false,
    length: 10,
    default: 'Pending',
  })
  status: string | null

  @Column('varchar', {
    name: 'refund',
    nullable: true,
    length: 200,
  })
  refund: string | null

  @Column('varchar', {
    name: 'address',
    nullable: true,
    length: 200,
  })
  address: string | null

  @Column('varchar', {
    name: 'paymentId',
    nullable: true,
    length: 100,
  })
  paymentId: string | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('date', {
    name: 'expiry',
    nullable: true,
  })
  expiry: Date | null
}

export const ormOptions: ConnectionOptions = {
  type: 'sqlite',
  database: `${process.cwd()}/db.sqlite`,
  entities: [Invoice],
  logging: false,
  synchronize: true,
}
