import { FreelancerProfile, ProfileType } from 'upwork-api/lib/routers/freelancers/search';
import { Education, Experience } from 'upwork-api/lib/routers/freelancers/profile';

// tslint:disable-next-line:no-empty-interface
export interface Candidate {
  id: string;
  skills: string[];
  categories2?: string[];
  feedback?: number;
  rate?: number;
  title: string;
  city: string;
  country: string;
  description: string;
  name: string;
  profile_type: ProfileType;
  portrait_50?: string;
  portrait_100?: string;
  education?: Education[];
  experience?: Experience[];
  link: string;
  username?: string;
  availability?: 'fullTime' | 'partTime' | 'notSure';
  updated?: Date;
}

export function fromProfile(p: FreelancerProfile): Candidate {
  const result = {
    ...p,
    feedback: p.feedback ? parseFloat(p.feedback) : undefined,
    rate: p.rate ? parseFloat(p.rate) : undefined,
    username: ((p.portrait_50 || '').match(/Users:([-_\w\d]+):PortraitUrl/) || ['', ''])[1],
    link: 'https://www.upwork.com/freelancers/' + p.id,
  };
  if (!result.username) {
    delete result.username;
  }
  return result;
}
