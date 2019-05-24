declare namespace Upwork {
  namespace Freelancers {
    namespace Profile {
      interface ProfileResponse {
        profile: {};
        auth_user: {
          first_name: string;
          last_name: string;
          timezone: string;
          timezone_offset: string;
        };
        server_time: string;
      }

      class Profile {
        constructor(api: Upwork.Api.UpworkApi);
        getSpecific(key: string, callback: ResultCallback<ProfileResponse>): void;
        getSpecificBrief(key: string, callback: ResultCallback<any>): void;
      }
    }
  }
}

declare module 'upwork-api/lib/routers/freelancers/profile' {
  export = Upwork.Freelancers.Profile;
}
