import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/response/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    return await this.productRepository.find(); // TODO: Map to response DTO
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: +id },
    });

    if (!product) throw new NotFoundException(`Product #${id} not found`);

    return product; // TODO: Map to response DTO
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product); // TODO: Map to response DTO
  }
}
