import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SearchQuery } from '../../entities';
import { CreateSearchDto } from '../../interfaces';

@Injectable()
export class SearchQueryService {
  constructor(@InjectRepository(SearchQuery) private searchQueries: MongoRepository<SearchQuery>) {}

  async create(data: CreateSearchDto) {
    const query = Object.assign(new SearchQuery(), data);
    await this.searchQueries.insert(query);
    return query;
  }

  async list(userId: string) {
    return await this.searchQueries.find({ where: { userId } });
  }

  async findOneOrFail(name: string, userId: string) {
    return await this.searchQueries.findOneOrFail({ where: { userId, name } });
  }
}
