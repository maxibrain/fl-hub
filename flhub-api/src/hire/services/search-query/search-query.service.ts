import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SearchQuery } from '../../entities';
import { SearchCandidatesOptions } from '../../interfaces';

@Injectable()
export class SearchQueryService {
  constructor(@InjectRepository(SearchQuery) private searchQueries: MongoRepository<SearchQuery>) {}

  async create(options: SearchCandidatesOptions) {
    const query = new SearchQuery();
    query.params = options;
    await this.searchQueries.insert(query);
    return query;
  }
}
