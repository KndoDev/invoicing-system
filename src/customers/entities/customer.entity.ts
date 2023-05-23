import { Invoice } from 'src/invoices/entities/invoice.entity';
import {
   Column,
   Entity,
   JoinColumn,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Customer {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('text', { unique: true })
   name: string;

   @Column('date')
   birthdate: Date;

   @OneToMany(() => Invoice, (invoice) => invoice.customer, { cascade: true })
   @JoinColumn()
   invoices?: Invoice[];
}
