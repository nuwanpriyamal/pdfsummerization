import { Injectable, Logger } from '@nestjs/common';
const PDFParser = require('pdf2json');

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async extractTextFromBuffer(buffer: Buffer, originalName?: string): Promise<string> {
    this.logger.log(`Extracting text from uploaded PDF buffer ${originalName || ''} using pdf2json...`);

    return new Promise((resolve) => {
      try {
        const pdfParser = new PDFParser(this, 1);
        
        pdfParser.on("pdfParser_dataError", (errData: any) => {
           this.logger.warn(`pdf2json failed to decode ${originalName}`, errData.parserError);
           resolve(this.getFallbackMessage(originalName));
        });
        
        pdfParser.on("pdfParser_dataReady", () => {
           const text = pdfParser.getRawTextContent();
           if (text && text.trim().length > 20) {
             this.logger.log('Successfully extracted text from PDF.');
             resolve(text);
           } else {
             resolve(this.getFallbackMessage(originalName));
           }
        });
        
        pdfParser.parseBuffer(buffer);
      } catch (error) {
        this.logger.error('Critical error parsing PDF buffer', error);
        resolve(this.getFallbackMessage(originalName));
      }
    });
  }

  private getFallbackMessage(originalName?: string): string {
    return `The document "${originalName || 'uploaded file'}" was received by the AI simulator, but its text layers are locked, flattened into images, or unreadable. No text could be extracted to summarize.`;
  }
}
