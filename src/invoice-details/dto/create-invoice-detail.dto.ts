import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Product } from 'src/products/entities/product.entity';

export class CreateInvoiceDetailDto {
   invoice: Invoice;
   product: Product;
   @IsInt()
   quantity?: number;

   @IsNumber()
   @IsPositive()
   amount: number;
}
