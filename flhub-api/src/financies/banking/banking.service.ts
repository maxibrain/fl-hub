import { Injectable } from '@nestjs/common';
import { BankAccount } from '../entities/bank-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class BankingService {
  constructor(@InjectRepository(BankAccount) private accounts: MongoRepository<BankAccount>) {}

  listBankAccounts(userId: string) {
    return this.accounts.find({ where: { userId } });
  }
}
