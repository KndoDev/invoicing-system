import { Customer } from 'src/customers/entities/customer.entity';
import { InvoiceDetail } from 'src/invoice-details/entities/invoice-detail.entity';
import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
   date: Date;

   @ManyToOne(() => Customer, (customer) => customer.invoices, {
      nullable: false,
   })
   @JoinColumn({ name: 'customer_id' })
   customer: Customer;

   @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice, {
      cascade: true,
   })
   @JoinColumn({ name: 'invoice_detail' })
   invoiceDetail: InvoiceDetail[];

   @Column('float', { default: 0 })
   total_amount: number;
}
