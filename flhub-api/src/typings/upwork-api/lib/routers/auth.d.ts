declare namespace Upwork {
  namespace Api {
    namespace Routers {
      interface GetUserInfoResponse {
        server_time: string;
        auth_user: {
          first_name: string;
          last_name: string;
          timezone: string;
          timezone_offset: string;
        };
        info: {
          portrait_50_img: string;
          ref: string;
          portrait_32_img: string;
          has_agency: '0' | '1';
          portrait_100_img: string;
          company_url: string;
          capacity: {
            provider: 'yes' | 'no';
            buyer: 'yes' | 'no';
            affiliate_manager: 'yes' | 'no';
          };
          location: {
            city: string;
            state: string;
            country: string;
          };
          profile_url: string;
        };
      }
      class Auth {
        constructor(api: UpworkApi);
        getUserInfo(callback: ResultCallback<GetUserInfoResponse>): void;
      }
    }
  }
}

declare module 'upwork-api/lib/routers/auth' {
  export = Upwork.Api.Routers;
}
