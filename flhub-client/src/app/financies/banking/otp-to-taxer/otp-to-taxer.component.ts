import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-otp-to-taxer',
  templateUrl: './otp-to-taxer.component.html',
  styleUrls: ['./otp-to-taxer.component.scss'],
})
export class OtpToTaxerComponent implements OnInit {
  private readonly fileContent$ = new Subject<string>();
  readonly parsed$ = this.fileContent$.pipe(map(html => this.parse(html)));

  constructor() {}

  ngOnInit() {}

  onFileChanged(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.fileContent$.next(e.target.result);
      };

      reader.readAsText(fileInput.target.files[0]);
    }
  }

  private parse(html: string) {
    return html.match(/Account in ABS:<\/td><td\/><td\/><td\/><td colspan="9" class="s3">(\d+)/g).map(s => s.substr(s.length - 14));
  }
}
