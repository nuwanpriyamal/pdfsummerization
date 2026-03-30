import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpenclawService {
  private readonly logger = new Logger(OpenclawService.name);

  async summarizeText(text: string): Promise<string> {
    this.logger.log('Sending text to OpenClaw AI for summarization...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (
      text.includes('text layers are locked') ||
      text.includes('unreadable')
    ) {
      return text; // Pass through the explicit fallback message untouched
    }

    const cleanText = text.replace(/\s+/g, ' ').trim();
    const sentences = cleanText
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 15);

    if (sentences.length === 0) {
      return 'Could not extract meaningful text from the provided PDF to summarize.';
    }

    const summaryPoints = sentences
      .slice(0, 3)
      .map((s) => `- ${s.trim()}.`)
      .join('\n');

    this.logger.log('Received summary from OpenClaw AI simulator');
    return `Automatic Summary of Uploaded Document:\\n\\n${summaryPoints}`;
  }
}
