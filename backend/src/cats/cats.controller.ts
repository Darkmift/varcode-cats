import {
  BadRequestException,
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
import extractUserDataFromRequest from '@/utils/extractUserDataFromRequest';

@ApiTags('cats')
@UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to all endpoints within the controller
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('top-five')
  @ApiOperation({ summary: 'Get top five cats' })
  @ApiResponse({ status: 200, type: CatDTO, isArray: true })
  getTopFive(@Req() request: Request) {
    const { id, cat_type_id, role } = extractUserDataFromRequest(request);
    const cats = this.catsService.getTopFive({ userId: id, cat_type_id, role });
    return cats;
  }

  @Get('search')
  @ApiOperation({ summary: 'Search cats with pagination' })
  @ApiResponse({ status: 200, type: CatDTO, isArray: true })
  getPaginated(@Query() query: PaginationParamsDTO, @Req() request: Request) {
    const { id, cat_type_id, role } = extractUserDataFromRequest(request);
    return this.catsService.getPaginated(
      { userId: id, cat_type_id, role },
      query,
    );
  }

  @Get('/id/:id')
  @ApiOperation({ summary: 'Get a cat by ID' })
  @ApiResponse({ status: 200, type: CatDTO })
  @ApiQuery({
    name: 'id',
    type: 'string',
    description: 'The ID of the cat to retrieve',
    example: 'some-uuid-string',
  })
  getById(@Param('id') id: string, @Req() request: Request) {
    const {
      id: userId,
      cat_type_id,
      role,
    } = extractUserDataFromRequest(request);

    return this.catsService.getById({
      role,
      cat_type_id,
      userId,
      catId: id,
    });
  }

  @Post('vote/:id')
  @ApiOperation({ summary: 'Vote for a cat' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the cat to vote for',
  })
  async voteForCat(@Param('id') catId: string, @Req() request: Request) {
    const { id, cat_type_id, role } = extractUserDataFromRequest(request);

    return await this.catsService.addVoteForCat({
      catId,
      userId: id,
      cat_type_id,
      role,
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
    const { id, cat_type_id, role } = extractUserDataFromRequest(request);

    return this.catsService.removeVoteForCat({
      catId,
      userId: id,
      cat_type_id,
      role,
    });
  }

  // add /like-by-user
  @Get('like-by-user')
  @ApiOperation({ summary: 'Get cats liked by user' })
  @ApiResponse({ status: 200, type: CatDTO, isArray: true })
  getLikedByUser(@Req() request: Request) {
    const { id, cat_type_id, role } = extractUserDataFromRequest(request);

    return this.catsService.getCatsLikedByUser({
      userId: id,
      cat_type_id,
      role,
    });
  }
}
