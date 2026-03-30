export declare class PdfService {
    private readonly logger;
    extractTextFromBuffer(buffer: Buffer, originalName?: string): Promise<string>;
    private getFallbackMessage;
}
