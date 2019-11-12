import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { AuthInterceptor } from './auth.interceptor';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './state';

@NgModule({
  declarations: [LoginComponent, AuthorizeComponent],
  imports: [SharedModule, HttpClientModule, AccountRoutingModule, NgxsModule.forFeature([AuthState])],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
})
export class AccountModule {}
