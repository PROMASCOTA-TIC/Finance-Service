import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { v4 as UuidV4 } from 'uuid';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transactions.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Transaction } from './models/transactions.model';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    private httpService: HttpService
  ) { }
  private readonly logger = new Logger('TransactionsService');

  async onModuleInit() {
    this.logger.log('Initializing database connection...');
    try {
      await this.transactionModel.sequelize.authenticate();
      this.logger.log('Connection to the database has been established successfully.');
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error.message);
    }
  }

  async getTotalWeeklySales(entrepreneurId: string) {
    const incomes = await firstValueFrom(
      this.httpService.post('http://localhost:3000/api/incomes/weekly-sales', entrepreneurId)
    );
    if (!incomes.data) {
      this.logger.error('Error getting weekly incomes:', incomes.data.message);
      throw new NotFoundException('Error getting weekly incomes:', incomes.data.message);
    }
    const totalSales = incomes.data.reduce((total: number, income: any) => total + Number(income.price), 0);
    return totalSales;
  }

  async createEntrepreneurPayment(createTransactionDto: CreateTransactionDto) {
    const { transactionDate: transactionDate, ...transactionData } = createTransactionDto;
    
    let newEntrepreneurPayment: Transaction;

    try {
      const totalSales = await this.getTotalWeeklySales(transactionData.entrepreneurId);

      const transactionDateMod = new Date(transactionDate);
      transactionDateMod.setHours(transactionDateMod.getHours() + 1);
      transactionDateMod.setMinutes(59, 59, 999);

      newEntrepreneurPayment = await this.transactionModel.create({
        id: UuidV4(),
        transactionDate: transactionDateMod,
        amount: totalSales,
        ...transactionData
      });

    } catch (error) {
      this.logger.error('Error creating transaction:', error.message);
      throw new Error(`Error creating transaction: ${error.message}`);
    }
    return newEntrepreneurPayment;
  }

  async findAllEntrepreneurPayment() {
    return await this.transactionModel.findAll().catch((error) => {
      this.logger.error('Error getting transactions:', error.message);
      throw new NotFoundException('Error getting transactions:', error.message);
    });
  }

  async findOneEntrepreneurPayment(id: string) {
    const transaction = await this.transactionModel.findByPk(id);
    if (!transaction) {
      this.logger.error(`transaction with id ${id} not found`);
      throw new NotFoundException(`transaction with id ${id} not found`);
    }
    return transaction;
  }

  async updateEntrepreneurPayment(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { id: _, ...data } = updateTransactionDto;
    const entrepreneurPayment = await this.findOneEntrepreneurPayment(id);
    let result: any;

    const expense = {
      category: "Pagos emprendedores",
      description: "Pago a emprendedor por venta de la semana",
      expenseDate: new Date(),
      price: entrepreneurPayment.amount,
    }

    try {
      result = await this.transactionModel.update(data, { where: { id } });
      this.httpService.post('http://localhost:3000/api/expenses', expense, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      this.logger.error('Error updating transaction:', error.message);
      throw new Error(`Error updating transaction: ${error.message}`);
    }
    return result;
  }

  //TODO: Llamar al microservicio de ordenes/ventas (jackson) para actualizar estado a rechazado o aceptado
  async validateTransfer(id: string, updateTransferDto: UpdateTransferDto) {
    return "valida y actualiza un pago";
  }
}
