import { Injectable, Logger, HttpService } from '@nestjs/common';
import { getObjectPatch, applyObjectPatch, isEmpty, applyObjectPatches, UpworkApiService, preventCircular } from '../../../shared';
import { CandidateProfile, SearchCandidatesOptions, fromProfile } from '../../interfaces';
import { FreelancerProfilePatch } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { FreelancerSearchParams, FreelancerProfile } from 'upwork-api/lib/routers/freelancers/search';
import { ProfileResponse } from 'upwork-api/lib/routers/freelancers/profile';

@Injectable()
export class ProfileService {
  constructor(
    private http: HttpService,
    private api: UpworkApiService,
    @InjectRepository(FreelancerProfilePatch) private profilePatches: MongoRepository<FreelancerProfilePatch>,
  ) {}

  async get(id: string): Promise<CandidateProfile> {
    const patches = await this.profilePatches.find({ where: { profileId: id } });
    return applyObjectPatches({} as CandidateProfile, patches.map(p => p.patch));
  }

  async list(ids: string[]): Promise<CandidateProfile[]> {
    const patches = await this.profilePatches.find({ where: { profileId: { $in: ids } } });
    const result: CandidateProfile[] = [];
    patches.forEach(p => {
      let i = result.findIndex(r => r.id === p.profileId);
      if (i < 0) {
        i = result.push({ id: p.profileId } as CandidateProfile) - 1;
      }
      let updated = p.id.getTimestamp();
      if (result[i].updated && result[i].updated > updated) {
        updated = result[i].updated;
      }
      result[i] = { ...applyObjectPatch(result[i], p.patch), updated };
    });
    result.filter(c => !c.id).forEach(c => Logger.log(c));
    return result;
  }

  async fetch(id: string) {
    const [apiProfile, crawledProfile] = await Promise.all([
      this.fetchApi(id),
      this.crawlPage(id).catch(err => {
        const res = err.response || err;
        try {
          Logger.error(res, null, 'Upwork Crawler');
        } catch {
          Logger.error(Object.keys(res), null, 'Upwork Crawler');
        }
        return { availability: { capacity: { nid: null } } };
      }),
    ]);
    const profile: CandidateProfile = {
      ...apiProfile,
      availability: crawledProfile.availability.capacity.nid,
    } as any;
    // name is always short here
    delete profile.name;
    // Logger.debug(profile);
    return await this.save(id, profile);
  }

  async save(id: string, profile: CandidateProfile) {
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

  async search(options: SearchCandidatesOptions): Promise<CandidateProfile[]> {
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
    const profileFilter = (p: FreelancerProfile) => p.country === options.country;
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
      return new Promise<CandidateProfile[]>(resolve => {
        setTimeout(
          () =>
            searchFn(pageOptions)
              .then(result => {
                Logger.log(`Page ${i + 1} OK`);
                resolve(filterProfiles(result.providers));
              })
              .catch(err => {
                Logger.error(`Page ${i + 1}: ${JSON.stringify(err)}`);
                resolve([]);
              }),
          i * 2000,
        );
      });
    });

    let candidates = await Promise.all(promises).then(arrayOfResults =>
      arrayOfResults
        .reduce((acc, providers) => [...acc, ...providers.filter(p => acc.map(a => a.id).indexOf(p.id) < 0)], initialProviders)
        .sort((a, b) => a.id.localeCompare(b.id)),
    );

    if (options.availableHours) {
      candidates = await Promise.all(
        candidates.map((c, i) =>
          new Promise(resolve => setTimeout(() => resolve(), 2000 * i))
            .then(() => this.fetch(c.id))
            .then(candidate => ({ ...c, ...candidate })),
        ),
      );
    }

    return candidates;
  }

  private async fetchApi(id: string): Promise<CandidateProfile> {
    const profile = await this.api.getProfile(id);
    return fromProfile(profile);
  }

  private proxyIndex = -1;
  private proxies: Array<{ host: string; port: number }> = [
    '1.1.170.101:8080',
    '213.100.168.84:41677',
    '47.254.94.44:443',
    '195.200.64.8:48885',
  ].map(s => {
    const parts = s.split(':');
    return { host: parts[0], port: parseInt(parts[1], 10) };
  });

  private getNextProxy() {
    this.proxyIndex++;
    if (this.proxyIndex >= this.proxies.length) {
      this.proxyIndex = 0;
    }
    return this.proxies[this.proxyIndex];
  }

  private async crawlPage(id: string) {
    const headers = {
      ['accept']: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      ['accept-language']: 'en-US,en;q=0.9,ru;q=0.8,uk;q=0.7',
      ['cache-control']: 'max-age=0',
      ['dnt']: '1',
      ['upgrade-insecure-requests']: '1',
      ['user-agent']: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    };

    const proxy = this.getNextProxy();

    return await this.http
      .get('https://www.upwork.com/freelancers/' + id, {
        headers,
        proxy,
      })
      .toPromise()
      .catch(err => {
        let details;
        try {
          details = JSON.stringify(err);
        } catch {
          details = '<cannot serialize>';
        }
        throw new Error(`Cannot get page using proxy ${proxy.host}:${proxy.port}.\r\nDetails: ${details}`);
      })
      .then(res => {
        return Buffer.from(res.data, 'utf8');
      })
      .then(buf => {
        const html = buf.toString('utf8');
        const matches = html.match(/var phpVars = .*;\n/gi);
        if (matches) {
          const json = matches[0].slice(matches[0].indexOf('{'), matches[0].lastIndexOf(';'));
          const model = JSON.parse(json);
          Logger.debug(model, 'Upwork Crawler');
          if (model && model.profileSettings && model.profileSettings.profile) {
            return model.profileSettings.profile;
          } else {
            Logger.warn(json, 'Upwork Crawler');
          }
        } else {
          Logger.warn(html, 'Upwork Crawler');
        }
        throw new Error('Cannot parse crawled page');
      });
  }
}
