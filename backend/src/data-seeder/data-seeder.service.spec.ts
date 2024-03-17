import { Test, TestingModule } from '@nestjs/testing';
import { DataSeederService } from './data-seeder.service';
import SharedTestingModule from '@/../test/shared/sharedTestingModule';

describe('DataSeederService', () => {
  let service: DataSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedTestingModule.register()],
    }).compile();

    service = module.get<DataSeederService>(DataSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
