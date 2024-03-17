import { Test, TestingModule } from '@nestjs/testing';
import { DataSeederService } from './data-seeder.service';

describe('DataSeederService', () => {
  let service: DataSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataSeederService],
    }).compile();

    service = module.get<DataSeederService>(DataSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
