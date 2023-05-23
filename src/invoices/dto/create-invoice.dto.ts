import { IsDateString, IsOptional } from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { InvoiceDetail } from 'src/invoice-details/entities/invoice-detail.entity';

export class CreateInvoiceDto {
   @IsOptional()
   date?: Date;
   @IsOptional()
   customer: Customer;
   @IsOptional()
   invoiceDetail: InvoiceDetail[];
}
