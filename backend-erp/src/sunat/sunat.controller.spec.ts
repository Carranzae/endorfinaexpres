import { Test, TestingModule } from '@nestjs/testing';
import { SunatController } from './sunat.controller';

describe('SunatController', () => {
  let controller: SunatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SunatController],
    }).compile();

    controller = module.get<SunatController>(SunatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
