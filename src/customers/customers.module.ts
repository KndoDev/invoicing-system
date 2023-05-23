import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Module({
   controllers: [CustomersController],
   providers: [CustomersService],
   imports: [TypeOrmModule.forFeature([Customer, Invoice])],
})
export class CustomersModule {}
