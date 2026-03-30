import { Module } from '@nestjs/common';
import { ScenarioController } from './scenario.controller';
import { PdfModule } from '../pdf/pdf.module';
import { OpenclawModule } from '../openclaw/openclaw.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PdfModule, OpenclawModule, EmailModule],
  controllers: [ScenarioController],
})
export class ScenarioModule {}
