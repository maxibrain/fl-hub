import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { FinanciesState } from './state/financies.state';

@NgModule({
  imports: [NgxsModule.forFeature([FinanciesState])],
})
export class FinanciesStateModule {}
