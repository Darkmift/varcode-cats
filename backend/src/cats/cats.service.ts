import { Injectable, Logger } from '@nestjs/common';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';
import { IVoteForCatParams } from './types/cats.type';
import { Repository } from 'typeorm';
import { Cat, CatVote } from './cats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@/auth/auth.service';
import { User } from '@/auth/user.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(CatVote)
    private voteRepository: Repository<CatVote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async getTopFive(): Promise<CatDTO[]> {
    const topCats = await this.catRepository
      .createQueryBuilder('cat')
      .leftJoin('cat_vote', 'cv', 'cv.cat_id = cat.id')
      .select('cat')
      .addSelect('COUNT(cv.id)', 'likes')
      .groupBy('cat.id')
      .orderBy('likes', 'DESC')
      .limit(5)
      .getRawMany();

    return topCats.map((cat) => this.mapToDTO(cat));
  }

  async getPaginated({
    page,
    limit,
    search,
  }: PaginationParamsDTO): Promise<PaginationResultDTO<CatDTO>> {
    const queryBuilder = this.catRepository
      .createQueryBuilder('cat')
      .leftJoin('cat_vote', 'cv', 'cv.cat_id = cat.id')
      .select('cat.*') 
      .addSelect('COUNT(cv.id)', 'likes')
      .groupBy('cat.id');

    if (search) {
      queryBuilder.where('cat.name ILIKE :search', { search: `%${search}%` });
    }

    
    const paginatedQuery = queryBuilder
      .orderBy('name', 'ASC') 
      .offset((page - 1) * limit)
      .limit(limit);

    const items = await paginatedQuery.getRawMany();
    const total = await queryBuilder.getCount();

    const catDTOs = items.map((cat) =>
      this.mapToDTO({
        ...cat,
        likes: parseInt(cat.likes, 10), 
      }),
    );

    const hasNext = total > page * limit;
    const hasPrev = page > 1;

    return {
      items: catDTOs,
      hasNext,
      total,
      hasPrev,
    };
  }

  private removePrefix(cat: Cat) {
    return Object.keys(cat).reduce((acc, key) => {
      const newKey = key.replace('cat_', '');
      acc[newKey] = cat[key];
      if (newKey === 'likes') {
        acc[newKey] = +cat[key];
      }
      return acc;
    }, {}) as Cat;
  }

  private mapToDTO(cat: Cat): CatDTO {
    const fixedCat = this.removePrefix(cat);
    return new CatDTO(fixedCat);
  }

  async getById(id: string): Promise<CatDTO> {
    const queryBuilder = this.catRepository
      .createQueryBuilder('cat')
      .leftJoin('cat_vote', 'cv', 'cv.cat_id = cat.id')
      .where('cat.id = :id', { id })
      .select('cat.*') 
      .addSelect('COUNT(cv.id)', 'likes') 
      .groupBy('cat.id');

    const result = await queryBuilder.getRawOne();

    if (!result) {
      Logger.warn('Cat not found', id);
      return null;
    }

    const catDTO = this.mapToDTO({
      ...result,
      likes: parseInt(result.likes, 10), 
    });

    return catDTO;
  }

  async addVoteForCat({ catId, userId }: IVoteForCatParams) {
    try {
      const voteExists = await this.voteRepository.findOneBy({
        cat: { id: catId },
        user: { id: userId },
      });
      if (voteExists) {
        throw new Error('Vote already exists');
      }

      const cat = await this.catRepository.findOneBy({ id: catId });
      if (!cat) {
        throw new Error('Cat not found');
      }

      const user = await this.authService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const vote = new CatVote();
      vote.cat = cat;
      vote.user = user;

      await this.voteRepository.save(vote);
      return vote;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async removeVoteForCat({ catId, userId }: IVoteForCatParams) {
    const voteExists = await this.voteRepository.findOneBy({
      cat: { id: catId },
      user: { id: userId },
    });
    if (!voteExists) {
      Logger.warn('Vote not found', {
        voteTodelete: voteExists,
        catId,
        userId,
      });
      return;
    }
    await this.voteRepository.remove(voteExists);
  }

  async getCatsLikedByUser(userId: string): Promise<CatDTO[]> {
    const votes = await this.voteRepository.find({
      where: { user: { id: userId } },
      relations: ['cat'],
    });

    return votes.map((vote) => this.mapToDTO(vote.cat));
  }
}
