import { Controller, Get, Post } from '@nestjs/common';
import * as fs from 'fs/promises';
import { LangChainService } from './langchain.service.js';

@Controller()
export class LangChainController {
  constructor(private readonly langService: LangChainService) {}

  /// creating vector store
  @Get('store')
  async createVectorStore() {
    const text = await fs.readFile('src/convo3.txt', 'utf8');
    return await this.langService.createVectorStore(text);
  }

  /// listing issues
  @Post('listissues')
  async getIssues() {
    return await this.langService.getIssues();
  }

  /// listing keywords
  @Post('listkeywords')
  async getKeywords() {
    return await this.langService.getKeywords();
  }

  /// listing challenges
  @Post('listchallenges')
  async getChallenges() {
    return await this.langService.getChallenges();
  }

  /// listing risks
  @Post('listrisks')
  async getRisks() {
    return await this.langService.getRisks();
  }

  /// listing solutions based on challenges
  @Post('listsolutionsonchallenges')
  async getSolutionsWRTChallenge() {
    return await this.langService.getSolutionsOnChallenges();
  }

  /// listing solutions based on challenges and risks
  @Post('listsolutionsonchallengesandrisks')
  async getSolutionsWRTChallengeRisk() {
    return await this.langService.getSolutionsOnChallengesAndRisks();
  }
}
