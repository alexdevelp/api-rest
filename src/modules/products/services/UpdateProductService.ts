import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    // REGRA DE NOGOCIO
    const product = await productsRepository.findOne(id);
    // 1-> verificar se produto existe
    if (!product) {
      throw new AppError('Product not found.');
    }

    // 2-> Verificar se o produto ja existe
    const productExists = await productsRepository.findByName(name);
    if (productExists && name !== product.name) {
      throw new AppError('There is already one with this name');
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
