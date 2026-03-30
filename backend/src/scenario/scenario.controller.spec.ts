import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioController } from './scenario.controller';
import { PdfService } from '../pdf/pdf.service';
import { OpenclawService } from '../openclaw/openclaw.service';
import { EmailService } from '../email/email.service';

describe('ScenarioController', () => {
  let controller: ScenarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenarioController],
      providers: [
        { provide: PdfService, useValue: {} },
        { provide: OpenclawService, useValue: {} },
        { provide: EmailService, useValue: {} },
      ]
    }).compile();

    controller = module.get<ScenarioController>(ScenarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
