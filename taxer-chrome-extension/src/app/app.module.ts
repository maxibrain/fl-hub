import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatListModule } from '@angular/material/list';
import { OtpComponent } from './otp/otp.component';
import { TaxerComponent } from './taxer/taxer.component';

@NgModule({
  declarations: [
    AppComponent,
    OtpComponent,
    TaxerComponent,
  ],
  imports: [
    BrowserModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
