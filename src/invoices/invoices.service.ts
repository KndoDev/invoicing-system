import {
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { InvoiceDetail } from 'src/invoice-details/entities/invoice-detail.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class InvoicesService {
   private readonly logger = new Logger('InvoicesService');

   constructor(
      @InjectRepository(Invoice)
      private readonly invoicesRepository: Repository<Invoice>,

      @InjectRepository(InvoiceDetail)
      private readonly invoiceDetailsRepository: Repository<InvoiceDetail>,

      @InjectRepository(Customer)
      private readonly customersRepository: Repository<Customer>,

      @InjectRepository(Product)
      private readonly productsRepository: Repository<Product>,
   ) {}

   async create(InvoiceDto: CreateInvoiceDto) {
      try {
         const { customer, date, invoiceDetail } = InvoiceDto;

         const customer_ = await this.customersRepository.findOne({
            where: { id: customer.toString() },
         });

         if (!customer_) {
            throw new NotFoundException('Customer not found');
         }

         const invoice = new Invoice();
         invoice.customer = customer_;
         invoice.date = date;

         let totalAmount = 0;

         const detailsToCreate = await Promise.all(
            invoiceDetail.map(async (detail) => {
               const product = await this.productsRepository.findOne({
                  where: { id: detail.product.toString() },
               });
               product.stock -= detail.quantity;
               await this.productsRepository.save(product);
               if (!product) {
                  throw new NotFoundException(
                     `Product not found: ${detail.product}`,
                  );
               }

               const invoiceDetail = new InvoiceDetail();
               invoiceDetail.invoice = invoice;
               invoiceDetail.product = product;
               invoiceDetail.quantity = detail.quantity;
               invoiceDetail.amount = product.price * detail.quantity;

               totalAmount += invoiceDetail.amount;

               return invoiceDetail;
            }),
         );

         invoice.total_amount = totalAmount;

         const createdInvoice = await this.invoicesRepository.save(invoice);

         await this.invoiceDetailsRepository.save(detailsToCreate);

         return createdInvoice;
      } catch (error) {
         console.log(error);
      }
   }

   async findAll(PaginationDto: PaginationDto) {
      const { limit = 10, offset = 0 } = PaginationDto;
      return await this.invoicesRepository.find({
         take: limit,
         skip: offset,
         relations: {
            invoiceDetail: true,
            customer: true,
         },
      });
   }

   async findOne(id: string) {
      const invoice = await this.invoicesRepository.findOne({
         where: { id: id },
         relations: {
            invoiceDetail: true,
            customer: true,
         },
      });
      if (!invoice) throw new NotFoundException();
      return invoice;
   }

   async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
      try {
         const invoice = await this.invoicesRepository.findOne({
            where: { id: id },

            relations: {
               invoiceDetail: true,
            },
         });

         if (!invoice) {
            throw new NotFoundException('Invoice not found');
         }

         const { customer, date, invoiceDetail } = updateInvoiceDto;

         if (customer) {
            const customer_ = await this.customersRepository.findOne({
               where: { id: customer.toString() },
            });
            if (!customer_) {
               throw new NotFoundException('Customer not found');
            }
            invoice.customer = customer_;
         }

         if (date) {
            invoice.date = date;
         }

         if (invoiceDetail) {
            const updatedInvoiceDetail = await Promise.all(
               invoiceDetail.map(async (detail) => {
                  const { id, product, quantity } = detail;
                  let invoiceDetail = invoice.invoiceDetail.find(
                     (d) => d.id === id,
                  );

                  if (!invoiceDetail) {
                     throw new NotFoundException(
                        `Invoice detail not found: ${id}`,
                     );
                  }

                  if (product) {
                     const product_ = await this.productsRepository.findOne({
                        where: { id: detail.product.toString() },
                     });
                     product_.stock -= detail.quantity;
                     if (!product_) {
                        throw new NotFoundException(
                           `Product not found: ${product}`,
                        );
                     }
                     invoiceDetail.product = product_;
                  }

                  if (quantity) {
                     invoiceDetail.quantity = quantity;
                     invoiceDetail.amount =
                        invoiceDetail.product.price * quantity;
                  }

                  return invoiceDetail;
               }),
            );

            invoice.invoiceDetail = updatedInvoiceDetail;
            invoice.total_amount = updatedInvoiceDetail.reduce(
               (acc, detail) => acc + detail.amount,
               0,
            );
         }

         const updatedInvoice = await this.invoicesRepository.save(invoice);
         return updatedInvoice;
      } catch (error) {
         this.handleDBException(error);
      }
   }

   async remove(id: string) {
      const invoice = await this.findOne(id);
      if (!invoice) throw new NotFoundException();
      return this.invoicesRepository.remove(invoice);
   }
   private handleDBException(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException('check server logs');
   }
}
