import { Injectable } from '@nestjs/common';
import {
  IAdmin,
  ILoginParams,
  ILoginResult,
  IUser,
  JwtDecodedPayload,
  Role,
} from './auth.types';
import { Repository } from 'typeorm';
import { Admin, User } from './user.entity';
import { compareStringToHash, hashString } from '@/utils/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  //a fn that creates a User
  async createUser(user: IUser): Promise<User> {
    user.password = await hashString(user.password);
    return this.userRepository.save(user as unknown as User);
  }

  //a fn that creates a admin
  async createAdmin(adminUser: IAdmin): Promise<Admin> {
    adminUser.password = await hashString(adminUser.password);
    return this.adminRepository.save(adminUser);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async login(user: ILoginParams): Promise<ILoginResult> {
    const userFound = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (!userFound) {
      return null;
    }

    const isPasswordValid = await compareStringToHash(
      user.password,
      userFound.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    const payload: JwtDecodedPayload = {
      username: user.username,
      id: userFound.id,
      role: Role.USER,
      cat_type_id: userFound.cat_type_id,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      firstname: userFound.first_name,
      lastname: userFound.last_name,
      username: userFound.username,
      cat_type_id: userFound.cat_type_id,
      role: Role.USER,
    };
  }

  async loginAdmin(admin: ILoginParams): Promise<ILoginResult> {
    const adminFound = await this.adminRepository.findOne({
      where: { username: admin.username },
    });
    if (!adminFound) {
      return null;
    }

    const isPasswordValid = await compareStringToHash(
      admin.password,
      adminFound.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    const payload: JwtDecodedPayload = {
      username: admin.username,
      id: adminFound.id,
      role: adminFound.accessLevel,
      cat_type_id: null,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      firstname: adminFound.first_name,
      lastname: adminFound.last_name,
      username: adminFound.username,
      role: Role.ADMIN,
      cat_type_id: null,
    };
  }
}
