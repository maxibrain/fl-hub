import { FreelancerProfile } from 'upwork-api/lib/routers/freelancers/search';

// tslint:disable-next-line:no-empty-interface
export interface Candidate extends FreelancerProfile {
  link: string;
  username: string;
  updated?: Date;
}

export function fromProfile(p: FreelancerProfile): Candidate {
  return {
    ...p,
    username: ((p.portrait_50 || '').match(/Users:([-_\w\d]+):PortraitUrl/) || [
      '',
      '',
    ])[1],
    link: 'https://www.upwork.com/freelancers/' + p.id,
  };
}
