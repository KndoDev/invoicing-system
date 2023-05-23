import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('text', { unique: true })
   name: string;

   @Column('float', { default: 0 })
   price: number;

   @Column('int', { default: 0 })
   stock: number;
}
