import { IsDate, IsDateString, IsString, MinLength } from 'class-validator';
import { Invoice } from 'src/invoices/entities/invoice.entity';

export class CreateCustomerDto {
   @IsString()
   @MinLength(1)
   name: string;

   @IsDateString()
   birthdate: Date;

   invoices: Invoice[];
}
