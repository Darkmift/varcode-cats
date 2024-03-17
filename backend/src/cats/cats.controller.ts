import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { JwtAuthGuard } from '@/auth/guards/auth.jwt';
import { CatDTO, PaginationParamsDTO } from './dto/cats.index';
import { Request } from 'express';

@ApiTags('cats')
@UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to all endpoints within the controller
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('top-five')
  @ApiOperation({ summary: 'Get top five cats' })
  @ApiResponse({ status: 200, type: CatDTO, isArray: true })
  getTopFive() {
    return this.catsService.getTopFive();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search cats with pagination' })
  @ApiResponse({ status: 200, type: CatDTO, isArray: true })
  getPaginated(@Query() query: PaginationParamsDTO) {
    return this.catsService.getPaginated(query);
  }

  @Get('get-by-id')
  @ApiOperation({ summary: 'Get a cat by ID' })
  @ApiResponse({ status: 200, type: CatDTO })
  @ApiQuery({
    name: 'id',
    type: 'string',
    description: 'The ID of the cat to retrieve',
    example: 'some-uuid-string',
  })
  getById(@Query('id') id: string) {
    return this.catsService.getById(id);
  }

  @Post('vote/:id')
  @ApiOperation({ summary: 'Vote for a cat' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the cat to vote for',
  })
  voteForCat(@Param('id') catId: string, @Req() request: Request) {
    return this.catsService.addVoteForCat({
      catId,
      userId: request.user.id,
    });
  }

  @Delete('vote/:id')
  @ApiOperation({ summary: 'Remove vote for a cat' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the cat to remove vote from',
  })
  removeVoteForCat(@Param('id') catId: string, @Req() request: Request) {
    // Similar to voteForCat, 'userId' would be extracted from JWT
    return this.catsService.removeVoteForCat({
      catId,
      userId: request.user.id,
    });
  }
}
