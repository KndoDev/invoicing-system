import {
   Injectable,
   InternalServerErrorException,
   Logger,
   NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {
   private readonly logger = new Logger('ProductsService');

   constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
   ) {}

   async create(createProductDto: CreateProductDto) {
      try {
         const product = this.productRepository.create(createProductDto);
         await this.productRepository.save(product);
         return product;
      } catch (error) {
         this.handleDBException(error);
      }
   }

   async findAll(PaginationDto: PaginationDto) {
      const { limit = 10, offset = 0 } = PaginationDto;
      return await this.productRepository.find({
         take: limit,
         skip: offset,
      });
   }

   async findOne(id: string) {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) throw new NotFoundException();
      return product;
   }

   async update(id: string, updateProductDto: UpdateProductDto) {
      const product = await this.productRepository.preload({
         id: id,
         ...updateProductDto,
      });
      if (!product) throw new NotFoundException(`Product #${id} not found`);
      try {
         return await this.productRepository.save(product);
      } catch (error) {
         this.handleDBException(error);
      }
   }

   async remove(id: string) {
      const product = await this.findOne(id);

      return await this.productRepository.remove(product);
   }
   private handleDBException(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException('check server logs');
   }
}
