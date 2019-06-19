import { Injectable, Logger } from '@nestjs/common';
import { UpworkApi } from 'upwork-api/lib/api';
import { FreelancerSearchParams, FreelancerSearchResult, Search, FreelancerProfile } from 'upwork-api/lib/routers/freelancers/search';
import { Profile, ProfileResponse } from 'upwork-api/lib/routers/freelancers/profile';

export interface UpworkSession {
  requestToken: string;
  requestTokenSecret: string;
  accessToken: string;
  accessSecret: string;
}

@Injectable()
export class UpworkApiService {
  private readonly api: UpworkApi;

  constructor() {
    const config = {
      consumerKey: process.env.UPWORK_CONSUMER_KEY,
      consumerSecret: process.env.UPWORK_CONSUMER_SECRET,
      accessToken: process.env.UPWORK_ACCESS_TOKEN,
      accessSecret: process.env.UPWORK_ACCESS_SECRET,
      debug: true,
    };

    this.api = new UpworkApi(config);
    const voidCallback = () => 0;
    this.api.setAccessToken(config.accessToken, config.accessSecret, voidCallback);
  }

  async authorize(session: UpworkSession, token: string, verifier: string): Promise<UpworkSession> {
    if (!session || !session.requestToken || !session.requestTokenSecret) {
      throw new Error('No OAuth session.');
    }
    if (!verifier) {
      throw new Error('No verifier.');
    }
    if (session.requestToken !== token) {
      throw new Error('Token mismatch.');
    }
    return await this.wrapFn(this.api, 'getAccessToken')(session.requestToken, session.requestTokenSecret, verifier).then(
      ([accessToken, accessSecret]) => ({
        ...session,
        accessToken,
        accessSecret,
      }),
    );
  }

  searchFreelancers(params: FreelancerSearchParams): Promise<FreelancerSearchResult> {
    const search = new Search(this.api);
    return new Promise((resolve, reject) => {
      search.find(params, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }

  getProfile(id: string, brief = false): Promise<FreelancerProfile> {
    const profileApi = new Profile(this.api);
    return new Promise((resolve, reject) => {
      const fn = brief ? profileApi.getSpecificBrief : profileApi.getSpecific;
      fn.bind(profileApi)(id, (err, res: ProfileResponse) => {
        if (err) {
          return reject(err);
        }
        // Logger.debug(res, 'Upwork API');
        const { profile } = res;
        const skills = (Array.isArray(profile.skills.skill) ? profile.skills.skill : [profile.skills.skill])
          .sort((a, b) => (parseInt(a.skl_rank, 10) > parseInt(b.skl_rank, 10) ? 1 : -1))
          .map(s => s.skl_name);
        return resolve({
          id: profile.ciphertext,
          name: profile.dev_first_name + ' ' + profile.dev_last_name,
          title: profile.dev_profile_title,
          country: profile.dev_country,
          city: profile.dev_city,
          description: profile.dev_blurb,
          portrait_100: profile.dev_portrait_100,
          profile_type: profile.dev_ac_agencies ? 'Agency' : 'Independent',
          feedback: profile.dev_adj_score,
          rate: profile.dev_bill_rate,
          skills,
          education: profile.education
            ? Array.isArray(profile.education.institution)
              ? profile.education.institution
              : [profile.education.institution]
            : [],
          experience: profile.experiences
            ? Array.isArray(profile.experiences.experience)
              ? profile.experiences.experience
              : [profile.experiences.experience]
            : [],
        });
      });
    });
  }

  private wrapFn<T, K extends keyof T>(obj: T, fnName: K): (...args: any[]) => Promise<any> {
    const fn = obj[fnName];
    if (typeof fn === 'function') {
      return (...args: any[]) => {
        return new Promise((resolve, reject) => {
          fn.apply(this, [
            ...args,
            (...results: any[]) => {
              if (results[0]) {
                return reject(results[0]);
              }
              return resolve.apply(this, results.slice(1));
            },
          ]);
        });
      };
    }
    throw new Error('Not a function');
  }
}
