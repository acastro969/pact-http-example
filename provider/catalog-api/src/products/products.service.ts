import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: Repository<Product>) {}

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    const product = this.productRepository.findOne({ where: { id: +id } });

    if (!product) throw new NotFoundException(`Product #${id} not found`);

    return product;
  }
}
