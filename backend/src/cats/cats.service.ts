import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';
import { IQueryCatsParams, IVoteForCatParams } from './types/cats.type';
import { Repository } from 'typeorm';
import { Cat, CatVote } from './cats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@/auth/auth.service';
import { User } from '@/auth/user.entity';
import { IUserParams, Role } from '@/auth/auth.types';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(CatVote)
    private voteRepository: Repository<CatVote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private createBaseQuery({ userId, role, cat_type_id }: IUserParams) {
    const querybuilder = this.catRepository.createQueryBuilder('cat');

    querybuilder
      .leftJoin('cat_vote', 'cv', 'cv.cat_id = cat.id')
      .leftJoin(
        CatVote,
        'cv2',
        'cv2.cat_id = cat.id AND cv2.user_id = :userId',
        { userId },
      )
      .select('cat.*')
      .addSelect('COUNT(cv.id)', 'likes')
      .addSelect(
        'SUM(CASE WHEN cv2.user_id IS NOT NULL THEN 1 ELSE 0 END) > 0',
        'likedByUser',
      )
      .groupBy('cat.id');
    if (role === Role.USER) {
      querybuilder.andWhere('cat_type_id = :cat_type_id', { cat_type_id });
    }

    return querybuilder;
  }

  async getTopFive({
    userId,
    role,
    cat_type_id,
  }: IUserParams): Promise<CatDTO[]> {
    const queryBuilder = await this.createBaseQuery({
      userId,
      role,
      cat_type_id,
    })
      .orderBy('likes', 'DESC')
      .limit(5)
      .getRawMany();

    const cats = queryBuilder.map((cat) => this.mapToDTO(cat));
    return cats;
  }

  async getPaginated(
    { role, cat_type_id, userId }: IUserParams,
    { page, limit, search }: PaginationParamsDTO,
  ): Promise<PaginationResultDTO<CatDTO>> {
    const queryBuilder = this.createBaseQuery({ userId, role, cat_type_id });
    if (search) {
      queryBuilder.andWhere('cat.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    queryBuilder
      .orderBy('name', 'ASC')
      .offset((page - 1) * limit)
      .limit(limit);

    const items = await queryBuilder.getRawMany();
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
      const newKey = key === 'cat_type_id' ? key : key.replace('cat_', '');
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

  async getById({
    catId,
    userId,
    cat_type_id,
    role,
  }: IUserParams & IQueryCatsParams): Promise<CatDTO> {
    const queryBuilder = this.createBaseQuery({
      userId,
      role,
      cat_type_id,
    }).where('cat.id = :catId', {
      catId,
    });

    const result = await queryBuilder.getRawOne();

    if (!result) {
      Logger.warn('Cat not found', catId);
      return null;
    }

    const catDTO = this.mapToDTO({
      ...result,
      likes: parseInt(result.likes, 10),
      likedByUser: result.likedByUser === true, // Ensure conversion to boolean
    });

    return catDTO;
  }

  /**
   * Adds a vote for a cat by a user, leveraging database constraints to ensure validity.
   * @param {IVoteForCatParams} { catId, userId } - The cat ID and user ID for the new vote.
   * @returns {Promise<CatDTO | null>} The updated cat information after adding the vote, or null in case of error.
   * @throws {BadRequestException} If the vote cannot be added due to database constraints.
   */
  async addVoteForCat({
    catId,
    userId,
    cat_type_id,
    role,
  }: IUserParams & IVoteForCatParams): Promise<CatDTO | null> {
    try {
      this.verifyUserCanVote({ catId, userId, role, cat_type_id });

      // Using QueryBuilder to directly insert into the cat_vote table
      await this.voteRepository.insert({
        cat: { id: catId },
        user: { id: userId },
      });

      // Assuming you want to return the updated cat information
      return this.getById({ userId, catId, cat_type_id, role }); // Make sure getById method is implemented to return a CatDTO or similar
    } catch (error) {
      Logger.error('Error adding vote:', error.message);
      throw new BadRequestException(
        'Failed to add vote due to database constraints.',
      );
    }
  }

  async removeVoteForCat({
    catId,
    userId,
    role,
    cat_type_id,
  }: IUserParams & IVoteForCatParams): Promise<CatDTO | null> {
    this.verifyUserCanVote({ catId, userId, role, cat_type_id });

    const voteExists = await this.voteRepository.findOneBy({
      cat: { id: catId },
      user: { id: userId },
    });
    if (!voteExists) {
      throw new NotFoundException(
        `Vote not found for catId: ${catId} and userId: ${userId}`,
      );
    }
    await this.voteRepository.remove(voteExists);
    return this.getById({ userId, catId, role, cat_type_id });
  }

  /**
   * Verifies that a user can vote for a cat, based on the user's role and the cat's type.
   * @param {IUserParams & IVoteForCatParams} { catId, userId, role, cat_type_id } - The cat ID, user ID, user role, and cat type.
   * @returns {Promise<void>} - A promise that resolves if the user can vote, or throws an error if not.
   * @throws {BadRequestException} If the user cannot vote for the cat.
   */
  private async verifyUserCanVote({
    catId,
    userId,
    role,
    cat_type_id,
  }: IUserParams & IVoteForCatParams) {
    if (role === Role.USER) {
      const cat = await this.catRepository.findOneBy({
        id: catId,
        // @ts-ignore
        cat_type_id: cat_type_id,
      });
      if (!cat) {
        throw new BadRequestException('Cat not found or not user type.');
      }
    }
  }

  async getCatsLikedByUser({
    userId,
    role,
    cat_type_id,
  }: IUserParams & Omit<IVoteForCatParams, 'catId'>): Promise<CatDTO[]> {
    const whereOptions = { user: { id: userId } };
    if (role === Role.USER) {
      whereOptions['cat'] = { cat_type_id };
    }

    const votes = await this.voteRepository.find({
      where: whereOptions,
      relations: ['cat'],
    });

    return votes.map((vote) => {
      vote.cat['likedByUser'] = true;
      return this.mapToDTO(vote.cat);
    });
  }
}
