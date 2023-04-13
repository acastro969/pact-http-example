import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepository.find(); // TODO: Map to response DTO
  }

  findOne(id: number) {
    const product = this.productRepository.findOne({ where: { id: +id } });

    if (!product) throw new NotFoundException(`Product #${id} not found`);

    return product; // TODO: Map to response DTO
  }
}
