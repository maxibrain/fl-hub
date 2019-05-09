import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateDto } from './interfaces/candidate.dto';
import { SearchCandidatesOptions } from './interfaces/search-candidates-options';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) { }

  createQuery(options: SearchCandidatesOptions) {
    return this.http.post('api/hire/query', options);
  }

  getAll() {
    return this.http.get<CandidateDto[]>('api/hire/candidates');
  }

  fetchAll() {
    return this.http.post('api/hire/candidates/update', {});
  }
}
