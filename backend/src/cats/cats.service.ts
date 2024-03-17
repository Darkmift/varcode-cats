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
  }: PaginationParamsDTO): Promise<PaginationResultDTO<CatDTO>> {
    const [items, total] = await this.catRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const catDTOs = items.map((cat) => this.mapToDTO(cat));

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

  async getById(id: string): Promise<Cat> {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      Logger.warn('Cat not found', id);
    }
    return cat;
  }

  async addVoteForCat({ catId, userId }: IVoteForCatParams) {
    const voteExists = await this.voteRepository.findOneBy({
      cat: { id: catId },
      user: { id: userId },
    });
    if (voteExists) {
      Logger.warn('Vote already exists');
      return null;
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
