import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   ParseUUIDPipe,
   Query,
} from '@nestjs/common';
import { InvoiceDetailsService } from './invoice-details.service';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('invoice-details')
export class InvoiceDetailsController {
   constructor(private readonly invoiceDetailsService: InvoiceDetailsService) {}

   @Post()
   create(@Body() createInvoiceDetailDto: CreateInvoiceDetailDto) {
      return this.invoiceDetailsService.create(createInvoiceDetailDto);
   }

   @Get()
   findAll(@Query() paginationDto: PaginationDto) {
      return this.invoiceDetailsService.findAll(paginationDto);
   }

   @Get(':id')
   findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.invoiceDetailsService.findOne(id);
   }

   @Patch(':id')
   update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateInvoiceDetailDto: UpdateInvoiceDetailDto,
   ) {
      return this.invoiceDetailsService.update(id, updateInvoiceDetailDto);
   }

   @Delete(':id')
   remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.invoiceDetailsService.remove(id);
   }
}
