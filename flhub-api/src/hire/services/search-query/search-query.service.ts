import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SearchQuery } from '../../entities';
import { CreateSearchDto } from '../../interfaces';

@Injectable()
export class SearchQueryService {
  constructor(@InjectRepository(SearchQuery) private searchQueries: MongoRepository<SearchQuery>) {}

  async create(data: CreateSearchDto) {
    const query = new SearchQuery();
    query.name = data.name;
    query.params = data.params;
    await this.searchQueries.insert(query);
    return query;
  }

  async list() {
    return await this.searchQueries.find();
  }
}
