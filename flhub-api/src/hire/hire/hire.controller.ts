import { Controller, Get, Param, Logger, Query, Post, Body } from '@nestjs/common';
import { ExportService } from '../../shared';
import { UpdateCandidateStatusDto } from '../interfaces/update-candidate-status.dto';
import { SearchCandidatesOptions } from '../interfaces';
import { CandidateService, SearchQueryService } from '../services';

@Controller('api/hire')
export class HireController {
  constructor(private candidates: CandidateService, private queries: SearchQueryService, private exportService: ExportService) {}

  @Post('query')
  async createQuery(@Body() query: SearchCandidatesOptions) {
    return await this.queries.create(query);
  }

  @Get('candidates')
  async getCandidates(@Query('query') query: string = null, @Query('format') format = 'json') {
    const result = await this.candidates.get(query);
    if (format === 'csv') {
      return this.exportService.toCsv(result);
    }
    return result;
  }

  @Post('candidates/update')
  async updateCandidates(@Body('query') query: string = null) {
    await this.candidates.update(query);
  }

  @Post('candidates/status')
  async updateCandidateStatus(@Body() dto: UpdateCandidateStatusDto) {
    await this.candidates.updateStatus(dto);
  }
}
