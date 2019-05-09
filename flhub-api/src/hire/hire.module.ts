import { Module } from '@nestjs/common';
import { HireController } from './hire/hire.controller';
import { CandidateService, SearchQueryService } from './services';
import { SharedModule } from '../shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerProfilePatch, CandidateStatusPatch, SearchQuery } from './entities';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([FreelancerProfilePatch, CandidateStatusPatch, SearchQuery])],
  controllers: [HireController],
  providers: [CandidateService, SearchQueryService],
})
export class HireModule {}
