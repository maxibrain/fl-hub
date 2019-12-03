import { Injectable } from '@nestjs/common';
import { MongoRepository, ObjectID } from 'typeorm';
import { BillingInfo } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BillingService {
  constructor(@InjectRepository(BillingInfo) private billingInfos: MongoRepository<BillingInfo>) {}

  async getBillingInfo(userId: string): Promise<BillingInfo> {
    return await this.billingInfos.findOneOrFail({ where: { userId } });
  }
}
