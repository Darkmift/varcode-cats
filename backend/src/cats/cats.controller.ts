import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CatsService, PaginationParams } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('top-five')
  getTopFive() {
    this.catsService.getTopFive();
  }

  @Get('search')
  getPaginated(@Query() query: PaginationParams) {
    return this.catsService.getPaginated(query);
  }

  @Get('get-by-id')
  getById(@Query('id') id: string) {
    return this.catsService.getById(id);
  }

  @Post('vote/:id')
  voteForCat(@Param('id') catId: string) {
    return this.catsService.addVoteForCat({ catId, userId: '1' });
  }

  @Delete('vote/:id')
  removeVoteForCat(@Param('id') catId: string) {
    return this.catsService.removeVoteForCat({ catId, userId: '1' });
  }
}
