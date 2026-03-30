"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OpenclawService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenclawService = void 0;
const common_1 = require("@nestjs/common");
let OpenclawService = OpenclawService_1 = class OpenclawService {
    logger = new common_1.Logger(OpenclawService_1.name);
    async summarizeText(text) {
        this.logger.log('Sending text to OpenClaw AI for summarization...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (text.includes('text layers are locked') || text.includes('unreadable')) {
            return text;
        }
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 15);
        if (sentences.length === 0) {
            return "Could not extract meaningful text from the provided PDF to summarize.";
        }
        const summaryPoints = sentences.slice(0, 3).map(s => `- ${s.trim()}.`).join('\n');
        this.logger.log('Received summary from OpenClaw AI simulator');
        return `Automatic Summary of Uploaded Document:\\n\\n${summaryPoints}`;
    }
};
exports.OpenclawService = OpenclawService;
exports.OpenclawService = OpenclawService = OpenclawService_1 = __decorate([
    (0, common_1.Injectable)()
], OpenclawService);
//# sourceMappingURL=openclaw.service.js.map