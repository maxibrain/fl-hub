import { Component } from '@angular/core';
import { AuthService } from '../../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const obs$ = this.auth.getUpworkAuthorizeUrl();
    obs$.subscribe(({ url }) => (window.location.href = url));
  }
}
