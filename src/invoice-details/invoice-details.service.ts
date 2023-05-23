import {
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class InvoiceDetailsService {
   private readonly logger = new Logger('InvoiceDetailsService');

   constructor(
      @InjectRepository(InvoiceDetail)
      private readonly invoiceDetailsRepository: Repository<InvoiceDetail>,

      @InjectRepository(Product)
      private readonly productsRepository: Repository<Product>,
   ) {}

   async create(createInvoiceDetailDto: CreateInvoiceDetailDto) {
      try {
         const invoiceDetail = this.invoiceDetailsRepository.create(
            createInvoiceDetailDto,
         );
         const product = await this.productsRepository.findOne({
            where: { id: createInvoiceDetailDto.product.toString() },
         });
         invoiceDetail.amount = product.price * createInvoiceDetailDto.quantity;

         await this.invoiceDetailsRepository.save(invoiceDetail);
         return invoiceDetail;
      } catch (error) {
         this.handleDBException(error);
      }
   }

   async findAll(PaginationDto: PaginationDto) {
      const { limit = 10, offset = 0 } = PaginationDto;
      return await this.invoiceDetailsRepository.find({
         take: limit,
         skip: offset,
      });
   }

   async findOne(id: string) {
      const invoiceDetail = await this.invoiceDetailsRepository.findOne({
         where: { id: id },
      });
      if (!invoiceDetail) throw new NotFoundException();
      return invoiceDetail;
   }

   async update(id: string, updateInvoiceDetailDto: UpdateInvoiceDetailDto) {
      try {
         const invoiceDetail = await this.invoiceDetailsRepository.findOne({
            where: { id: id },
         });

         if (!invoiceDetail) {
            throw new NotFoundException('Invoice detail not found');
         }

         const { product, quantity } = updateInvoiceDetailDto;

         if (product) {
            const product_ = await this.productsRepository.findOne({
               where: { id: product.toString() },
            });
            if (!product_) {
               throw new NotFoundException(`Product not found: ${product}`);
            }
            invoiceDetail.product = product_;
         }

         if (quantity) {
            invoiceDetail.quantity = quantity;
            invoiceDetail.amount = invoiceDetail.product.price * quantity;
         }

         const updatedInvoiceDetail = await this.invoiceDetailsRepository.save(
            invoiceDetail,
         );
         return updatedInvoiceDetail;
      } catch (error) {
         console.log(error);
      }
   }

   async remove(id: string) {
      const invoiceDetail = await this.invoiceDetailsRepository.findOne({
         where: { id: id },
      });
      if (!invoiceDetail) throw new NotFoundException();
      try {
         return await this.invoiceDetailsRepository.remove(invoiceDetail);
      } catch (error) {
         this.handleDBException(error);
      }
   }
   private handleDBException(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException('check server logs');
   }
}
