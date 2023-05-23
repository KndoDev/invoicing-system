import { Module } from '@nestjs/common';
import { InvoiceDetailsService } from './invoice-details.service';
import { InvoiceDetailsController } from './invoice-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { Product } from 'src/products/entities/product.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Module({
   controllers: [InvoiceDetailsController],
   providers: [InvoiceDetailsService],
   imports: [TypeOrmModule.forFeature([InvoiceDetail, Product, Invoice])],
})
export class InvoiceDetailsModule {}
