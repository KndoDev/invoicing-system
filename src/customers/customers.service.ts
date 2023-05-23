import {
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CustomersService {
   private readonly logger = new Logger('CustomersService');

   constructor(
      @InjectRepository(Customer)
      private readonly customersRepository: Repository<Customer>,
      @InjectRepository(Invoice)
      private readonly invoicesRepository: Repository<Invoice>,
   ) {}

   async create(createCustomerDto: CreateCustomerDto) {
      const { invoices = [], ...customerData } = createCustomerDto;
      const customer = this.customersRepository.create({
         ...customerData,
         invoices: invoices.map((invoice) =>
            this.invoicesRepository.create(invoice),
         ),
      });
      await this.customersRepository.save(customer);
      return customer;
   }

   async findAll(PaginationDto: PaginationDto) {
      const { limit = 10, offset = 0 } = PaginationDto;
      return await this.customersRepository.find({
         take: limit,
         skip: offset,
      });
   }

   async findOne(id: string) {
      const customer = await this.customersRepository.findOneBy({ id });
      if (!customer) throw new NotFoundException();
      return customer;
   }

   async update(id: string, updateCustomerDto: UpdateCustomerDto) {
      const customer = await this.customersRepository.preload({
         id: id,
         ...updateCustomerDto,
      });
      if (!customer) throw new NotFoundException(`Customer #${id} not found`);
      try {
         return this.customersRepository.save(customer);
      } catch (error) {
         this.handleDBException(error);
      }
   }

   async remove(id: string) {
      const customer = await this.customersRepository.findOneBy({ id });
      return await this.customersRepository.remove(customer);
   }

   private handleDBException(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException('check server logs');
   }
}
