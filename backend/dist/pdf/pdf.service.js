"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const PDFParser = require('pdf2json');
let PdfService = PdfService_1 = class PdfService {
    logger = new common_1.Logger(PdfService_1.name);
    async extractTextFromBuffer(buffer, originalName) {
        this.logger.log(`Extracting text from uploaded PDF buffer ${originalName || ''} using pdf2json...`);
        return new Promise((resolve) => {
            try {
                const pdfParser = new PDFParser(this, 1);
                pdfParser.on("pdfParser_dataError", (errData) => {
                    this.logger.warn(`pdf2json failed to decode ${originalName}`, errData.parserError);
                    resolve(this.getFallbackMessage(originalName));
                });
                pdfParser.on("pdfParser_dataReady", () => {
                    const text = pdfParser.getRawTextContent();
                    if (text && text.trim().length > 20) {
                        this.logger.log('Successfully extracted text from PDF.');
                        resolve(text);
                    }
                    else {
                        resolve(this.getFallbackMessage(originalName));
                    }
                });
                pdfParser.parseBuffer(buffer);
            }
            catch (error) {
                this.logger.error('Critical error parsing PDF buffer', error);
                resolve(this.getFallbackMessage(originalName));
            }
        });
    }
    getFallbackMessage(originalName) {
        return `The document "${originalName || 'uploaded file'}" was received by the AI simulator, but its text layers are locked, flattened into images, or unreadable. No text could be extracted to summarize.`;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map