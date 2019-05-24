import { Controller, Get, Param, Logger, Query, Post, Body } from '@nestjs/common';
import { ExportService } from '../../shared';
import { UpdateCandidateStatusDto } from '../interfaces/update-candidate-status.dto';
import { SearchCandidatesOptions, CreateSearchDto } from '../interfaces';
import { CandidateService, SearchQueryService, ProfileService } from '../services';

@Controller('api/hire')
export class HireController {
  constructor(
    private candidates: CandidateService,
    private profiles: ProfileService,
    private queries: SearchQueryService,
    private exportService: ExportService,
  ) {}

  @Post('query')
  async createQuery(@Body() query: CreateSearchDto) {
    return await this.queries.create(query);
  }

  @Get('query')
  async listQueries() {
    return await this.queries.list();
  }

  @Get('search/:query/candidates')
  async listCandidates(@Param('query') query: string, @Query('format') format = 'json') {
    const result = await this.candidates.list(query);
    if (format === 'csv') {
      return this.exportService.toCsv(result);
    }
    return result;
  }

  @Get('search/:query/candidates/:id')
  async getCandidate(@Param('query') query: string, @Param('id') id: string) {
    return await this.candidates.get(id, query);
  }

  @Post('candidates/update')
  async updateCandidates(@Body('query') query: string) {
    await this.candidates.update(query);
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
