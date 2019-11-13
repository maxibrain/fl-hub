import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getUpworkAuthorizeUrl() {
    const callbackUrl = window.location.origin + this.location.prepareExternalUrl('/account/authorize');
    return this.api.get<{ url: string }>('api/auth/upwork/url', {
      params: { callbackUrl },
    });
  }

  authorize(oauthToken: string, oauthVerifier: string): Observable<{ accessToken: string }> {
    if (!oauthToken || !oauthVerifier) {
      throw new Error('Invalid argument');
    }
    return this.api.post<{ accessToken: string }>('api/auth/upwork/authorize', { oauthToken, oauthVerifier });
  }

  constructor(private api: ApiService, private location: Location) {}
}
