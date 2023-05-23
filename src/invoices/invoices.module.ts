import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { InvoiceDetail } from 'src/invoice-details/entities/invoice-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';

@Module({
   controllers: [InvoicesController],
   providers: [InvoicesService],
   imports: [
      TypeOrmModule.forFeature([Invoice, Customer, InvoiceDetail, Product]),
   ],
})
export class InvoicesModule {}
