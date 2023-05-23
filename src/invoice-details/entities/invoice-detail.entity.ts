import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Product } from 'src/products/entities/product.entity';
import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class InvoiceDetail {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetail, {
      nullable: false,
   })
   @JoinColumn({ name: 'invoice_id' })
   invoice: Invoice;

   @ManyToOne(() => Product, (product) => product.id, {
      nullable: false,
   })
   @JoinColumn({ name: 'product_id' })
   product: Product;

   @Column('int', { default: 1 })
   quantity: number;

   @Column('float', { default: 0 })
   amount: number;
}
