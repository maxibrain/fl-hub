import { Component } from '@angular/core';
import { AuthService, AuthorizeAction } from '../../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
})
export class AuthorizeComponent {
  constructor(private auth: AuthService, private route: ActivatedRoute, private store: Store, private router: Router) {
    this.route.queryParams.pipe(take(1)).subscribe(queryParams => {
      this.auth.authorize(queryParams['oauth_token'], queryParams['oauth_verifier']).subscribe(({ accessToken }) => {
        this.store.dispatch(new AuthorizeAction(accessToken));
        this.router.navigate(['/']);
      });
    });
  }
}
