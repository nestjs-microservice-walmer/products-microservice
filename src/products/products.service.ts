import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  public readonly logger=new Logger('ProductsService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado')
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data:createProductDto
    })
    return 'This action adds a new product';
  }

  async listaPorPaginado(paginationDto:PaginationDto) {
    const {page,limit}=paginationDto
    const totalPages=await this.product.count({
      where:{
        estado:true
      }
    });
    const lastPages=Math.ceil(totalPages/limit)
    if (page > lastPages) {
      throw new Error('Página fuera de rango');
    }
    return {
      data:await  this.product.findMany({
        where:{
          estado:true
        },
        skip:(page-1)*limit,
        take:limit
      }),
      meta:{
        totalPages,
        page,
        lastPages
      }
    }
  }
  async findAll() {
    return await this.product.findMany({
      where:{
        estado:true
      }
    });
  }

  async findOne(id: number) {
    const product=await this.product.findFirst({
      where:{
        id,
        estado:true
      }
    })
    if(!product){
      throw new NotFoundException(` Product no encontrado ${id}`)
    }
    return product;
  }
  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id:__,...updateProductDto_new}=updateProductDto
    await this.findOne(id)
    return await this.product.update({
      where:{id},
      data:updateProductDto_new
    })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.product.update({
      where:{id},
      data:{
        estado:false
      }
    })
    // return this.product.delete( {where:{id}})
  }
}
