import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    //REGRAS DE NEGÓCIO
    // 1-> Verificar se o produto ja existe
    const productExists = await productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one with this name');
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
