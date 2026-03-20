import { Test, TestingModule } from '@nestjs/testing';
import { QrSessionsService } from './qr-sessions.service';

describe('QrSessionsService', () => {
  let service: QrSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrSessionsService],
    }).compile();

    service = module.get<QrSessionsService>(QrSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
