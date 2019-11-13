import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from './state';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = this.store.selectSnapshot(AuthState.token);
    if (!token) {
      this.router.navigate(['/account/login']);
    }
    return !!token;
  }

  constructor(private store: Store, private router: Router) {}
}
