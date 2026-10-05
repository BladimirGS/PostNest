import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ){}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(async (transactionEntityManager) => {
      const transaction = new Transaction(); 
      transaction.total = createTransactionDto.contents.reduce((total, item) => total + ( item.quantity * item.price ), 0 )

      await transactionEntityManager.save(transaction);

      for(const content of createTransactionDto.contents) {
        const errors: string[] = []

        const product = await transactionEntityManager.findOneBy(Product, {id: content.productId})

        if(!product) {
          errors.push(`El producto con el ID: ${content.productId} no existe`)
          throw new NotFoundException(errors)
        }
        
        if(product.inventory < content.quantity) {
          errors.push(`El articulo ${product.name} excede la cantidad disponible`)
          throw new BadRequestException(errors)
        }

        product.inventory -= content.quantity;
        await transactionEntityManager.save(product)

        const transactionContent = new TransactionContents();
        transactionContent.price = content.price;
        transactionContent.product = product;
        transactionContent.quantity = content.quantity;
        transactionContent.transaction = transaction;
        await transactionEntityManager.save(transactionContent)
      }
    })

    return 'Venta almacenada correctamente'
  }

  findAll(transactionDate: string) {
    const options: FindManyOptions<Transaction> = {
      relations: { contens: true }
    }

    if(transactionDate) {
      const date = parseISO(transactionDate);
      if(!isValid(date)) {
        throw new BadRequestException('Fecha no válida')
      }

      const start = startOfDay(date)
      const end = endOfDay(date)

      options.where = {
        transactionDate: Between(start, end)
      }
    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {id},
      relations: {
        contens: true
      }
    });

    if(!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
