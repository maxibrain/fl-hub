import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SearchQuery } from '../interfaces/search-query';
import { HireState } from '../state/hire.state';
import { MatDialog } from '@angular/material';
import { CreateQueryComponent } from '../create-query/create-query.component';
import { CreateSearchQuery } from '../state/hire.actions';
import { CreateSearchDto } from '../interfaces/create-search.dto';

@Component({
  selector: 'app-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.scss'],
})
export class QueryListComponent implements OnInit {
  @Select(HireState.queries) list$: Observable<SearchQuery[]>;

  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit() {}

  addQuery() {
    this.promptQueryDetails().subscribe(q => this.store.dispatch(new CreateSearchQuery(q)));
  }

  private promptQueryDetails(): Observable<CreateSearchDto> {
    const dialogRef = this.dialog.open(CreateQueryComponent);
    return dialogRef.afterClosed();
  }
}
