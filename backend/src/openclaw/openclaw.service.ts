import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpenclawService {
  private readonly logger = new Logger(OpenclawService.name);
  private readonly summaryEndpoint = 'http://127.0.0.1:8787/summarize';
  private readonly apiKey =
    '406a4b53539a7dad5206cf0203bf0bc7f655fd9e7469f26d12d3a48dc0e6d751';
  private readonly timeoutMs = Number(20000);

  async summarizeText(text: string): Promise<string> {
    if (!text || !text.trim()) {
      return 'No text was provided to summarize.';
    }

    if (
      text.includes('text layers are locked') ||
      text.includes('unreadable')
    ) {
      return text; // Pass through the explicit fallback message untouched
    }

    this.logger.log('Preparing text summarization request...');
    if (!this.summaryEndpoint) {
      this.logger.warn(
        'OPENCLAW_SUMMARY_ENDPOINT is not set. Using local summary fallback.',
      );
      return this.localFallbackSummary(text);
    }

    try {
      return await this.requestOpenclawSummary(text);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown request error';
      this.logger.warn(
        `OpenClaw endpoint failed (${message}). Falling back to local summary.`,
      );
      return this.localFallbackSummary(text);
    }
  }

  private async requestOpenclawSummary(text: string): Promise<string> {
    this.logger.log(
      `Sending text to OpenClaw summarization endpoint: ${this.summaryEndpoint}`,
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(this.summaryEndpoint, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        task: 'summarize',
        text,
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const body: unknown = await response.json();
    const summary = this.extractSummary(body);
    if (!summary) {
      throw new Error('Response did not include a recognizable summary field');
    }

    this.logger.log('Received summary from OpenClaw endpoint');
    return summary;
  }

  private extractSummary(payload: unknown): string {
    if (typeof payload === 'string') {
      return payload.trim();
    }

    if (!this.isRecord(payload)) {
      return '';
    }

    const directKeys = ['summary', 'result', 'output', 'output_text'];
    for (const key of directKeys) {
      const value = payload[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    const choicesValue = payload['choices'];
    if (Array.isArray(choicesValue) && choicesValue.length > 0) {
      const firstChoice: unknown = choicesValue[0];
      if (this.isRecord(firstChoice)) {
        const choiceText = firstChoice.text;
        if (typeof choiceText === 'string' && choiceText.trim()) {
          return choiceText.trim();
        }

        const message = firstChoice.message;
        if (this.isRecord(message) && typeof message.content === 'string') {
          return message.content.trim();
        }
      }
    }

    const contentValue = payload['content'];
    if (Array.isArray(contentValue) && contentValue.length > 0) {
      const firstPart: unknown = contentValue[0];
      if (this.isRecord(firstPart) && typeof firstPart.text === 'string') {
        return firstPart.text.trim();
      }
    }

    return '';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private localFallbackSummary(text: string): string {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const sentences = cleanText
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 15);

    if (sentences.length === 0) {
      return 'Could not extract meaningful text from the provided content to summarize.';
    }

    const summaryPoints = sentences
      .slice(0, 3)
      .map((s) => `- ${s.trim()}.`)
      .join('\n');

    return `Automatic Summary of Uploaded Document:\\n\\n${summaryPoints}`;
  }
}
