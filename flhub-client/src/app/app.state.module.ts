import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthStateModule, AuthState } from './auth';
import { FinanciesStateModule, FinanciesState } from './financies';

@NgModule({
  imports: [
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsFormPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({ key: [...FinanciesState.KEYS_TO_STORE, ...AuthState.KEYS_TO_STORE] }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AuthStateModule,
    FinanciesStateModule,
  ],
})
export class AppStateModule {}
