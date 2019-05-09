import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
  toCsv(array: any[]): string {
    if (array.length < 1) {
      return '';
    }
    const headers = Object.keys(array[0]);
    let result = headers.join(',') + '\r\n';
    array.forEach(el => {
      result +=
        headers
          .map(key => el[key] || '')
          // tslint:disable-next-line:ban-types
          .map((v: Object) => v.toString())
          .map(s => (s.includes(',') ? `"${s}"` : s))
          .join(',') + '\r\n';
    });
    return result;
  }
}
