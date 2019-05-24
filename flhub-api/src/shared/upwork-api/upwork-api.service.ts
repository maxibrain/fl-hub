import { Injectable } from '@nestjs/common';
import { UpworkApi } from 'upwork-api/lib/api';
import { FreelancerSearchParams, FreelancerSearchResult, Search } from 'upwork-api/lib/routers/freelancers/search';
import { Profile } from 'upwork-api/lib/routers/freelancers/profile';

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

  getProfile(id: string, brief = false): Promise<any> {
    const profile = new Profile(this.api);
    return new Promise((resolve, reject) => {
      profile.getSpecificBrief(id, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
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
