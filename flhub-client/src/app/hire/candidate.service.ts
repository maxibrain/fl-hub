import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateDto } from './interfaces/candidate.dto';
import { SearchQuery } from './interfaces/search-query';
import { CreateSearchDto } from './interfaces/create-search.dto';
import { UpdateCandidateStatusDto } from './interfaces/update-candidate-status.dto';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private http: HttpClient) {}

  createQuery(data: CreateSearchDto) {
    return this.http.post<SearchQuery>('api/hire/query', data);
  }

  listQueries() {
    return this.http.get<SearchQuery[]>('api/hire/query');
  }

  list(query: string) {
    return this.http.get<CandidateDto[]>('api/hire/search/' + query + '/candidates');
  }

  get(query: string, id: string) {
    return this.http.get<CandidateDto>('api/hire/search/' + query + '/candidates/' + id);
  }

  fetchAll(query: string) {
    return this.http.post('api/hire/candidates/update', { query });
  }

  updateStatus(status: UpdateCandidateStatusDto) {
    return this.http.post('api/hire/candidate/status', status);
  }

  updateProfile(id: string) {
    return this.http.post<any>('api/hire/candidate/' + id + '/update', null);
  }
}
