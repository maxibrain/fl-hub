import { Module, HttpModule } from '@nestjs/common';
import { HireController } from './hire/hire.controller';
import { CandidateService, SearchQueryService, ProfileService } from './services';
import { SharedModule } from '../shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerProfilePatch, CandidateStatusPatch, SearchQuery } from './entities';

@Module({
  imports: [HttpModule, SharedModule, TypeOrmModule.forFeature([FreelancerProfilePatch, CandidateStatusPatch, SearchQuery])],
  controllers: [HireController],
  providers: [CandidateService, ProfileService, SearchQueryService],
})
export class HireModule {}
