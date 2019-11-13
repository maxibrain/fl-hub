import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthorizeComponent } from './authorize/authorize.component';

@NgModule({
  declarations: [LoginComponent, AuthorizeComponent],
  imports: [SharedModule, HttpClientModule, AccountRoutingModule],
})
export class AccountModule {}
