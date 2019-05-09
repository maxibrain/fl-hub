import UpworkApi from 'upwork-api';

declare module search {
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

  interface FreelancerProfile {
    id: string;
    skills: string[];
    categories2: string[];
    feedback: string;
    rate: string;
    title: string;
    country: string;
    description: string;
    name: string;
    profile_type: ProfileType;
    portrait_50: string;
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
    constructor(api: UpworkApi);
    find(params: FreelancerSearchParams, callback: ResultCallback<FreelancerSearchResult>): void;
  }
}

export = search;
