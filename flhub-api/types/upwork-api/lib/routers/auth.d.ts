import UpworkApi from 'upwork-api';

declare module auth {
  export class Auth {
    constructor(api: UpworkApi);
    getUserInfo(callback: ResultCallback): void;
  }
}

export = auth;