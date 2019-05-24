import { Injectable, Logger, HttpService } from '@nestjs/common';
import * as zlib from 'zlib';
import { Profile } from 'upwork-api/lib/routers/freelancers/profile';
import { getObjectPatch, applyObjectPatch, isEmpty, applyObjectPatches, UpworkApiService } from '../../../shared';
import { Candidate, SearchCandidatesOptions, fromProfile } from '../../interfaces';
import { FreelancerProfilePatch } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { FreelancerSearchParams, FreelancerProfile } from 'upwork-api/lib/routers/freelancers/search';

@Injectable()
export class ProfileService {
  constructor(
    private http: HttpService,
    private api: UpworkApiService,
    @InjectRepository(FreelancerProfilePatch) private profilePatches: MongoRepository<FreelancerProfilePatch>,
  ) {}

  async get(id: string): Promise<Candidate> {
    const patches = await this.profilePatches.find({ where: { profileId: id } });
    return applyObjectPatches({} as Candidate, patches.map(p => p.patch));
  }

  async list(ids: string[]): Promise<Candidate[]> {
    const patches = await this.profilePatches.find({ where: { profileId: { $in: ids } } });
    const result: Candidate[] = [];
    patches.forEach(p => {
      let i = result.findIndex(r => r.id === p.profileId);
      if (i < 0) {
        i = result.push({} as Candidate) - 1;
      }
      result[i] = { ...applyObjectPatch(result[i], p.patch), updated: p.id.getTimestamp() };
    });
    return result;
  }

  async fetch(id: string) {
    const crawledProfile = await this.crawlPage(id);
    const profile: Candidate = {
      id,
      availability: crawledProfile.availability.capacity.nid,
    } as any;
    return await this.save(id, profile);
  }

  async save(id: string, profile: Candidate) {
    const stored = await this.get(profile.id);
    const patch = getObjectPatch(profile, stored);
    if (!isEmpty(patch)) {
      const patchEntity = new FreelancerProfilePatch();
      patchEntity.patch = patch;
      patchEntity.profileId = profile.id;
      await this.profilePatches.insert(patchEntity);
      return applyObjectPatch(stored, patch);
    }
    return stored;
  }

  async search(options: SearchCandidatesOptions): Promise<Candidate[]> {
    const pageSize = 100;
    const initialOptions: FreelancerSearchParams = {
      q: options.query,
      skills: (options.skills || []).join(';'),
      profile_type: options.profileType,
      category2: options.category,
      paging: `0;${pageSize}`,
      rate: `[0 TO ${options.maxRate}]`,
      loc: options.country,
    };
    const initialResult = await this.api.searchFreelancers(initialOptions);

    const count = initialResult.paging.total;
    const profileFilter = (p: Candidate) => p.country === options.country;
    const filterProfiles = (profiles: FreelancerProfile[]) => profiles.filter(profileFilter).map(p => fromProfile(p));
    const initialProviders = filterProfiles(initialResult.providers);

    const searchFn = this.api.searchFreelancers.bind(this.api);
    const promises = new Array(Math.ceil((count - initialResult.providers.length) / pageSize)).fill(0).map((_, i) => {
      Logger.log(`Page ${i + 1} running...`);
      const offset = (i + 1) * pageSize;
      const pageOptions = {
        ...initialOptions,
        paging: `${offset};${pageSize}`,
      };
      return new Promise<Candidate[]>(resolve => {
        setTimeout(
          () =>
            searchFn(pageOptions)
              .then(result => {
                Logger.log(`Page ${i + 1} OK`);
                resolve(filterProfiles(result.providers));
              })
              .catch(err => {
                Logger.error(`Page ${i + 1} ERROR: ${err}`);
                resolve([]);
              }),
          Math.floor(i / 10) * 2000,
        );
      });
    });

    return await Promise.all(promises).then(arrayOfResults =>
      arrayOfResults
        .reduce((acc, providers) => [...acc, ...providers.filter(p => acc.map(a => a.id).indexOf(p.id) < 0)], initialProviders)
        .sort((a, b) => a.id.localeCompare(b.id)),
    );
  }

  private async fetchApi(id: string): Promise<Candidate> {
    const profile = await this.api.getProfile(id);
    Logger.log(profile);
    return profile;
  }

  private async crawlPage(id: string) {
    const reqHeaders = {
      ['accept']: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      ['accept-language']: 'en-US,en;q=0.9,ru;q=0.8,uk;q=0.7',
      ['cache-control']: 'max-age=0',
      ['dnt']: '1',
      ['upgrade-insecure-requests']: '1',
      ['user-agent']: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    };

    return await this.http
      .get('https://www.upwork.com/freelancers/' + id, {
        headers: reqHeaders,
      })
      .toPromise()
      .then(res => {
        const encoding = res.headers['content-encoding'];
        if (encoding === 'br') {
          return zlib.brotliDecompressSync(Buffer.from(res.data, 'utf8'));
        } else {
          return Buffer.from(res.data, 'utf8');
        }
      })
      .then(buf => {
        const matches = buf.toString('utf8').match(/var phpVars = .*;\n/gi);
        if (matches) {
          const json = matches[0].slice(matches[0].indexOf('{'), matches[0].lastIndexOf(';'));
          return JSON.parse(json).profileSettings.profile;
        }
        return {};
      });
  }
}
