import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { v4 as UuidV4 } from 'uuid';
import { UpdateTransactionDto } from './dto/update-transactions.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Transaction } from './models/transactions.model';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Sequelize } from 'sequelize-typescript';
import { URL_BASE } from '../../config';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    private httpService: HttpService,
    private sequelize: Sequelize
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

  async getEntrepreneurs() {
    const entrepreneurs = await firstValueFrom(
      this.httpService.get(`${URL_BASE}users/entrepreneurs`)
    );
    if (!entrepreneurs.data) {
      this.logger.error('Error getting entrepreneurs:', entrepreneurs.data.message);
      throw new NotFoundException('Error getting entrepreneurs:', entrepreneurs.data.message);
    }
    const filteredEntrepreneurs = entrepreneurs.data
      .filter((entrepreneur: any) => entrepreneur.estado === 'APPROVED')
      .map((entrepreneur: any) => ({
        idEntrepreneur: entrepreneur.idEntrepreneur,
        userId: entrepreneur.userId,
        nombreEmprendimiento: entrepreneur.nombreEmprendimiento,
        name: entrepreneur.user.name,
        comision: entrepreneur.comision
      }));
    return filteredEntrepreneurs;
  }

  async getTotalWeeklySales(entrepreneurId: string) {
    const weeklySales = await firstValueFrom(
      this.httpService.get(`${URL_BASE}incomes/weekly-sales/` + entrepreneurId)
    );
    if (!weeklySales.data) {
      this.logger.error('Error getting weekly incomes:', weeklySales.data.message);
      throw new NotFoundException('Error getting weekly incomes:', weeklySales.data.message);
    }
    const totalSales = weeklySales.data.reduce((total: number, weeklySale: any) => total + Number(weeklySale.amount), 0);
    return totalSales;
  }

  @Cron('0 0 * * 1') // Run every Monday at midnight
  // @Cron(CronExpression.EVERY_MINUTE)
  async createEntrepreneurPayment() {
    const entrepreneurs = await this.getEntrepreneurs();
    try {
      entrepreneurs.forEach(async (entrepreneur: any) => {
        const totalSales = await this.getTotalWeeklySales(entrepreneur.idEntrepreneur);
        const commission = entrepreneur.comision
        const response = await firstValueFrom(
          this.httpService.post(`${URL_BASE}commissions/calculate-entrepreneur-commission`, {
            amount: totalSales,
            commission: commission
          })
        );
        const totalPayment = totalSales - response.data;
        if (totalPayment > 0) {
          const entrepreneurPayment = await this.transactionModel.create({
            id: UuidV4(),
            transactionDate: new Date().setHours(1, 59, 59, 999),
            amount: totalPayment,
            state: 'P',
            entrepreneurId: entrepreneur.idEntrepreneur,
            commissionValue: response.data
          });
        }
      });
    } catch (error) {
      this.logger.error('Error creating transaction:', error.message);
      throw new Error(`Error creating transaction: ${error.message}`);
    }
    return "Entrepreneur payment created successfully";
  }

  async findAllEntrepreneursPayments() {
    try {
      const transactions = await this.transactionModel.findAll({
        order: [['transactionDate', 'DESC']]
      }).catch((error) => {
        this.logger.error('Error getting transactions:', error.message);
        throw new NotFoundException('Error getting transactions:', error.message);
      });
      const entrepreneurs = await this.getEntrepreneurs();
      const transactionsWithEntrepreneur = transactions.map((transaction) => {
        const entrepreneur = entrepreneurs.find((entrepreneur: any) => entrepreneur.idEntrepreneur === transaction.entrepreneurId);
        return { ...transaction.toJSON(), entrepreneurName: entrepreneur.name, entrepreneurBusiness: entrepreneur.nombreEmprendimiento };
      });
      return transactionsWithEntrepreneur;
    } catch (error) {
      this.logger.error('Error getting transactions:', error.message);
      throw new NotFoundException('Error getting transactions:', error.message);
    }
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
    const entrepreneurPayment = await this.transactionModel.findOne({
      where: { id: id },
      order: [['transactionDate', 'DESC']]
    });
    let result: any;
    const tran = await this.sequelize.transaction();
    try {
      result = await this.transactionModel.update(data, { where: { id }, transaction: tran });
      if (entrepreneurPayment.state === 'P' && updateTransactionDto.state === 'S') {
        const expense = {
          category: "Pagos emprendedores",
          description: "Pago a emprendedor por venta de la semana",
          expenseDate: new Date(new Date().setHours(new Date().getHours() - 6)),
          price: entrepreneurPayment.amount,
        }
        const income = {
          userId: entrepreneurPayment.entrepreneurId,
          commissionValue: entrepreneurPayment.commissionValue,
          category: "Entrepreneur",
        }
        const responseI = await firstValueFrom(this.httpService.post(`${URL_BASE}incomes`, { ...income }, {
          headers: { 'Content-Type': 'application/json' },
        }));
        const responseE = await firstValueFrom(this.httpService.post(`${URL_BASE}expenses`, { ...expense }, {
          headers: { 'Content-Type': 'application/json' },
        }));
        await tran.commit();
        return result;
      }
      if (entrepreneurPayment.state === 'S' && updateTransactionDto.state === 'S') {
        await tran.commit();
        return result;
      }
    } catch (error) {
      await tran.rollback();
      this.logger.error('Error updating transaction:', error.message);
      throw new Error(`Error updating transaction: ${error.message}`);
    }
    return result;
  }

  async validateTransfer(updateTransferDto: UpdateTransferDto) {
    console.log(updateTransferDto);
    const { id } = updateTransferDto;
    const url = `${URL_BASE}payments/${id}`;
    console.log(url);
    try {
      const payment = await firstValueFrom(this.httpService.patch(url, { ...updateTransferDto }, {
        headers: { 'Content-Type': 'application/json' },
      }));
      console.log("success", payment.data);
    } catch (error) {
      this.logger.error('Error validating transfer:', error.message);
      console.error('Error en la petición:', error.response?.data || error.message);
      throw new Error(`Error validating transfer: ${error.message}`);
    }
    return "Transfer validated successfully";
  }

  async getTransfers() {
    const payments = await firstValueFrom(
      this.httpService.get(`${URL_BASE}payments`)
    );
    const transfers = await Promise.all(payments.data
      .filter((payment: any) => payment.paymentMethod === 'Transfer')
      .map(async (payment: any) => {
        const order = await this.getOrderById(payment.orderId);
        const petOwner = await this.getPetOwnerById(order.userId);
        return {
          id: payment.id,
          paymentDate: order.createdAt,
          petOwnerName: petOwner.name,
          amount: payment.amount,
          observation: payment.comment,
          state: payment.status,
          voucherUrl: payment.voucherUrl
        };
      }));
    return transfers;
  }

  async getOrderById(orderId: string) {
    const order = await firstValueFrom(this.httpService.post(`${URL_BASE}orders/` + orderId));
    return order.data;
  }

  async getPetOwnerById(userId: string) {
    const petOwner = await firstValueFrom(this.httpService.get(`${URL_BASE}users/pet-owner/` + userId));
    return petOwner.data;
  }
}