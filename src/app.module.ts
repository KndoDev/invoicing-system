import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoiceDetailsModule } from './invoice-details/invoice-details.module';

@Module({
   imports: [
      ConfigModule.forRoot(),

      TypeOrmModule.forRoot({
         type: 'postgres',
         host: process.env.POSTGRES_HOST,
         port: parseInt(process.env.POSTGRES_PORT),
         username: process.env.POSTGRES_USER,
         password: process.env.POSTGRES_PASSWORD,
         database: process.env.POSTGRES_DB,
         autoLoadEntities: true,
         synchronize: true,
      }),

      ProductsModule,

      CommonModule,

      CustomersModule,

      InvoicesModule,

      InvoiceDetailsModule,
   ],
})
export class AppModule {}
