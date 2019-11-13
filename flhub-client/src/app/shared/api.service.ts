import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T = any>(
    url: string,
    options?: {
      params: any;
    },
  ) {
    return this.http.get<T>(this.buildUrl(url), options);
  }

  post<T = any>(
    url: string,
    body?: any,
    options?: {
      params: any;
    },
  ) {
    return this.http.post<T>(this.buildUrl(url), body, options);
  }

  private buildUrl(url: string) {
    return environment.apiUrl + url;
  }
}
