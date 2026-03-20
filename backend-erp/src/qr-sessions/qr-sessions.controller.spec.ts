import { Test, TestingModule } from '@nestjs/testing';
import { QrSessionsController } from './qr-sessions.controller';

describe('QrSessionsController', () => {
  let controller: QrSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrSessionsController],
    }).compile();

    controller = module.get<QrSessionsController>(QrSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
