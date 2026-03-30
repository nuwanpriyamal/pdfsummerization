import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import { OpenclawModule } from './openclaw/openclaw.module';
import { EmailModule } from './email/email.module';
import { ScenarioModule } from './scenario/scenario.module';

@Module({
  imports: [PdfModule, OpenclawModule, EmailModule, ScenarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
