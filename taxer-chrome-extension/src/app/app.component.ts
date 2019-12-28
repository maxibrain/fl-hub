import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Freelance Hub';
  sampleData: Array<{ type: 'Income' | 'Expense'; dateTime: Date }> = [{ type: 'Expense', dateTime: new Date() }];

  readonly serverUrl$ = new Observable(obs => chrome.storage.sync.get(({ serverUrl }) => { obs.next(serverUrl); obs.complete(); }));

  setServer(serverUrl: string) {
    chrome.storage.sync.set({ serverUrl });
  }

  fillData(data: Array<{ type: 'Income' | 'Expense'; dateTime: Date }>) {
    const operationTypeMap = new Map([
      ['Income', 0],
      ['Expense', 1],
    ]);
    data.forEach(op => {
      const operationTypeIndex = operationTypeMap.get(op.type);
      console.log(operationTypeIndex);
      // tslint:disable:max-line-length
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.executeScript(tabs[0].id, {
          code: `
        document.getElementsByClassName("finances-tab__controls")[0].firstElementChild.firstElementChild.click();
        operationTypeLink = document.getElementsByClassName("finances-popup-tabs__input")[0].firstElementChild;
        for (var i = 0; i < ${operationTypeIndex}; i++) {
          operationTypeLink = operationTypeLink.nextElementSibling;
        }
        operationTypeLink.click();
        dateInput = document.getElementsByClassName("operation-popup__date-input")[0].firstElementChild.firstElementChild;
        dateInput.value = ${op.dateTime.toDateString()};
        `,
        });
      });
      // tslint:enable:max-line-length
    });
  }
}
