import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { FreelancerProfile, FreelancerSearchParams } from 'upwork-api/lib/routers/freelancers/search';
import { UpworkApiService, applyObjectPatches, applyObjectPatch, getObjectPatch, createObjectFromPatches } from '../../../shared';
import {
  CandidateStatusPatch,
  FreelancerProfilePatch,
  SearchQuery,
  createInitialCandidateStatusPatch,
  createCandidateStatusPatch,
} from '../../entities';
import {
  Candidate,
  fromProfile,
  CandidateDto,
  CandidateTracker,
  UpdateCandidateStatusDto,
  SearchCandidatesOptions,
} from '../../interfaces';

@Injectable()
export class CandidateService {
  constructor(
    private api: UpworkApiService,
    @InjectRepository(SearchQuery) private searchQueries: MongoRepository<SearchQuery>,
    @InjectRepository(CandidateStatusPatch) private trackerPatches: MongoRepository<CandidateStatusPatch>,
    @InjectRepository(FreelancerProfilePatch) private profilePatches: MongoRepository<FreelancerProfilePatch>,
  ) {}

  private async loadProfile(id: string): Promise<Candidate> {
    const patches = await this.profilePatches.find({ where: { profileId: id } });
    return applyObjectPatches({} as Candidate, patches.map(p => p.patch));
  }

  private async loadProfiles(ids: string[]): Promise<Candidate[]> {
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

  private async loadTrackers(searchQueryId: string | string[]): Promise<CandidateTracker[]> {
    const where = Array.isArray(searchQueryId) ? { $in: searchQueryId } : { searchQueryId };
    const patches = await this.trackerPatches.find({ where });
    const result: CandidateTracker[] = [];
    patches.forEach(p => {
      let i = result.findIndex(r => r.profileId === p.profileId);
      if (i < 0) {
        i = result.push({} as CandidateTracker) - 1;
      }
      result[i] = { ...applyObjectPatch(result[i], p), reviewDate: p.id.getTimestamp() };
    });
    return result;
  }

  private async loadTracker(searchQueryId: string, profileId: string): Promise<CandidateTracker> {
    const patches = await this.trackerPatches.find({ where: { searchQueryId, profileId } });
    const result: CandidateTracker = createObjectFromPatches(
      patches.map(p => ({ ...p, reviewDate: p.id.getTimestamp() } as CandidateTracker)),
    );
    return result;
  }

  async list(searchName?: string): Promise<CandidateDto[]> {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: searchName }, select: ['id'] });
    const trackers = await this.loadTrackers(searchQuery.id.toHexString());
    const profiles = await this.loadProfiles(trackers.map(t => t.profileId));
    return profiles.map(profile => ({
      profile,
      tracker: trackers.find(t => t.profileId === profile.id),
    }));
  }

  async get(profileId: string, searchName?: string): Promise<CandidateDto> {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: searchName }, select: ['id'] });
    const profile = await this.loadProfile(profileId);
    const tracker = await this.loadTracker(searchQuery.id.toHexString(), profileId);
    return {
      profile,
      tracker,
    };
  }

  async update(searchName?: string) {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: searchName } });
    const profiles = await this.fetchAll(searchQuery.params);
    profiles.forEach(async profile => {
      const stored = await this.loadProfile(profile.id);
      const patch = getObjectPatch(profile, stored);
      const patchEntity = new FreelancerProfilePatch();
      patchEntity.patch = patch;
      patchEntity.profileId = profile.id;
      await this.profilePatches.insert(patchEntity);
      const tracker = await this.loadTracker(searchQuery.id.toHexString(), profile.id);
      if (!tracker) {
        const statusPatch = createInitialCandidateStatusPatch(searchQuery.id.toHexString(), profile.id);
        await this.trackerPatches.insert(statusPatch);
      }
    });
  }

  async updateStatus(update: UpdateCandidateStatusDto) {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: update.searchName } });
    const candidate = await this.loadProfile(update.id);
    if (!candidate) {
      throw new BadRequestException();
    }
    const patch = createCandidateStatusPatch(searchQuery.id.toHexString(), update.id, update.status, update.comment);
    await this.trackerPatches.insert(patch);
  }

  private async fetchAll(options: SearchCandidatesOptions): Promise<Candidate[]> {
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
}
