/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Logger,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from '../pdf/pdf.service';
import { OpenclawService } from '../openclaw/openclaw.service';
import { EmailService } from '../email/email.service';

@Controller('scenario')
export class ScenarioController {
  private readonly logger = new Logger(ScenarioController.name);

  constructor(
    private readonly pdfService: PdfService,
    private readonly openclawService: OpenclawService,
    private readonly emailService: EmailService,
  ) {}

  @Post('trigger')
  @UseInterceptors(FileInterceptor('file'))
  async triggerScenario(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(
      'Triggering OpenClaw scenario: Summarize uploaded PDF and Email',
    );
    try {
      if (!file) {
        throw new Error('No PDF file uploaded');
      }

      // 1. Extract text from uploaded PDF buffer
      const pdfText = await this.pdfService.extractTextFromBuffer(
        file.buffer,
        file.originalname,
      );

      // 2. Summarize with OpenClaw AI
      const summary = await this.openclawService.summarizeText(pdfText);

      // 3. Email summary
      const previewUrl = await this.emailService.sendSummaryToManager(summary);

      return {
        success: true,
        message: 'Scenario completed successfully',
        summary,
        emailPreviewUrl: previewUrl,
      };
    } catch (error: any) {
      this.logger.error(
        'Error during scenario execution',
        error.message || error,
      );
      throw new HttpException(
        {
          success: false,
          error: 'Scenario failed to execute: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
