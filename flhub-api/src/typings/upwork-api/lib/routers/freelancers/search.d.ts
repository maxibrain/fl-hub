declare namespace Upwork {
  namespace Freelancers {
    type ProfileType = 'Agency' | 'Independent';

    interface FreelancerSearchParams {
      q?: string;
      title?: string;
      skills?: string;
      category2?: string;
      subcategory2?: string;
      region?: string;
      loc?: string;
      rate?: string;
      hours?: string;
      profile_type?: ProfileType;
      paging?: string;
    }

    export interface FreelancerProfile {
      id: string;
      skills: string[];
      categories2?: string[];
      feedback?: string;
      rate: string;
      title: string;
      city: string;
      country: string;
      description: string;
      name: string;
      profile_type: ProfileType;
      portrait_50?: string;
      portrait_100?: string;
      education?: Upwork.Freelancers.Profile.Education[];
      experience?: Upwork.Freelancers.Profile.Experience[];
    }

    interface Paging {
      offset: number;
      count: number;
      total: number;
    }

    interface FreelancerSearchResult {
      providers: Array<FreelancerProfile>;
      paging: Paging;
    }

    class Search {
      constructor(api: Upwork.Api.UpworkApi);
      find(params: FreelancerSearchParams, callback: ResultCallback<FreelancerSearchResult>): void;
    }
  }
}

declare module 'upwork-api/lib/routers/freelancers/search' {
  export = Upwork.Freelancers;
}
