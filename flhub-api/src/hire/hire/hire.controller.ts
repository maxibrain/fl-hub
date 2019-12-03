import { Controller, Get, Param, Logger, Query, Post, Body, UseGuards } from '@nestjs/common';
import { ExportService } from '../../shared';
import { AuthGuard, AuthUser, User } from '../../auth';
import { UpdateCandidateStatusDto } from '../interfaces/update-candidate-status.dto';
import { SearchCandidatesOptions, CreateSearchDto } from '../interfaces';
import { CandidateService, SearchQueryService, ProfileService } from '../services';
import { SearchQueryParam } from './search-query.decorator';
import { SearchQuery } from '../entities';

@Controller('api/hire')
@UseGuards(AuthGuard)
export class HireController {
  constructor(
    private candidates: CandidateService,
    private profiles: ProfileService,
    private queries: SearchQueryService,
    private exportService: ExportService,
  ) {}

  @Post('query')
  async createQuery(@Body() query: CreateSearchDto, @AuthUser() { id }: User) {
    return await this.queries.create({ ...query, userId: id });
  }

  @Get('query')
  async listQueries(@AuthUser() { id }: User) {
    return await this.queries.list(id);
  }

  @Get('search/:query/candidates')
  async listCandidates(@SearchQueryParam('query') query: SearchQuery, @Query('format') format = 'json') {
    const result = await this.candidates.list(query);
    if (format === 'csv') {
      return this.exportService.toCsv(result);
    }
    return result;
  }

  @Get('search/:query/candidates/:id')
  async getCandidate(@Param('query') name: string, @Param('id') id: string) {
    const query = await this.queries.findOneOrFail(name, id);
    return await this.candidates.get(id, query);
  }

  @Post('candidates/update')
  async updateCandidates(@Body('query') name: string) {
    const query = await this.candidates.update(name);
  }

  @Post('candidate/status')
  async updateCandidateStatus(@Body() dto: UpdateCandidateStatusDto) {
    await this.candidates.updateStatus(dto);
  }

  @Post('candidate/:id/update')
  async updateCandidateProfile(@Param('id') id: string) {
    return await this.profiles.fetch(id);
  }
}
