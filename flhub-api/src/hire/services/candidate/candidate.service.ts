import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UpworkApiService, applyObjectPatch, createObjectFromPatches } from '../../../shared';
import { CandidateStatusPatch, SearchQuery, createInitialCandidateStatusPatch, createCandidateStatusPatch } from '../../entities';
import { CandidateDto, CandidateTracker, UpdateCandidateStatusDto } from '../../interfaces';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class CandidateService {
  constructor(
    private profiles: ProfileService,
    @InjectRepository(SearchQuery) private searchQueries: MongoRepository<SearchQuery>,
    @InjectRepository(CandidateStatusPatch) private trackerPatches: MongoRepository<CandidateStatusPatch>,
  ) {}

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
    const profiles = await this.profiles.list(trackers.map(t => t.profileId));
    return profiles.map(profile => ({
      profile,
      tracker: trackers.find(t => t.profileId === profile.id),
    }));
  }

  async get(profileId: string, searchName?: string): Promise<CandidateDto> {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: searchName }, select: ['id'] });
    const profile = await this.profiles.get(profileId);
    const tracker = await this.loadTracker(searchQuery.id.toHexString(), profileId);
    return {
      profile,
      tracker,
    };
  }

  async update(searchName?: string) {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: searchName } });
    const profiles = await this.profiles.search(searchQuery.params);
    profiles.forEach(async profile => {
      await this.profiles.save(profile.id, profile);
      const tracker = await this.loadTracker(searchQuery.id.toHexString(), profile.id);
      if (!tracker) {
        const statusPatch = createInitialCandidateStatusPatch(searchQuery.id.toHexString(), profile.id);
        await this.trackerPatches.insert(statusPatch);
      }
    });
  }

  async updateStatus(update: UpdateCandidateStatusDto) {
    const searchQuery = await this.searchQueries.findOneOrFail({ where: { name: update.searchName } });
    const candidate = await this.profiles.get(update.id);
    if (!candidate) {
      throw new BadRequestException();
    }
    const patch = createCandidateStatusPatch(searchQuery.id.toHexString(), update.id, update.status, update.comment);
    await this.trackerPatches.insert(patch);
  }
}
