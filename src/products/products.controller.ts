import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({cmd:'create'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  // @Post('createAll')
  @MessagePattern({cmd:'createAll'})
  async createAll(@Payload() createProductDto: CreateProductDto[]) {
    return  await Promise.all(
      createProductDto.map(async (dto) => {
        try {
          return await this.productsService.create(dto);
        } catch (error) {
          // Manejar error para cada producto en particular
          return { error: `Error al crear el producto: ${dto.nombre}`, details: error.message };
        }
      })
    );
  }

  // @Get('listaPorPaginado')
  @MessagePattern({cmd:'listaPorPaginado'})
  listaPorPaginado(@Payload() pagination:PaginationDto) {
    return this.productsService.listaPorPaginado(pagination);
  }
  // @Get()
  @MessagePattern({cmd:'findAll'})
  findAll() {
    return this.productsService.findAll();
  }

  // @Get(':id')
  @MessagePattern({cmd:'findOne'})
  findOne(@Payload('id',ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({cmd:'update'})
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  update( @Payload() updateProductDto: UpdateProductDto) {
    // el mas es para convertir a positivo o sino se agrega el ParseIntPipe
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({cmd:'remove'})
  remove(@Payload('id',ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
