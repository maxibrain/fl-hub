declare namespace Upwork {
  namespace Api {
    namespace Routers {
      export class Auth {
        constructor(api: UpworkApi);
        getUserInfo(callback: ResultCallback): void;
      }
    }
  }
}

declare module 'upwork-api/lib/routers' {
  export = Upwork.Api.Routers;
}
