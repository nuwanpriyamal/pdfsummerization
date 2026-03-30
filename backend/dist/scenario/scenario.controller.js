"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScenarioController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pdf_service_1 = require("../pdf/pdf.service");
const openclaw_service_1 = require("../openclaw/openclaw.service");
const email_service_1 = require("../email/email.service");
let ScenarioController = ScenarioController_1 = class ScenarioController {
    pdfService;
    openclawService;
    emailService;
    logger = new common_1.Logger(ScenarioController_1.name);
    constructor(pdfService, openclawService, emailService) {
        this.pdfService = pdfService;
        this.openclawService = openclawService;
        this.emailService = emailService;
    }
    async triggerScenario(file) {
        this.logger.log('Triggering OpenClaw scenario: Summarize uploaded PDF and Email');
        try {
            if (!file) {
                throw new Error('No PDF file uploaded');
            }
            const pdfText = await this.pdfService.extractTextFromBuffer(file.buffer, file.originalname);
            const summary = await this.openclawService.summarizeText(pdfText);
            const previewUrl = await this.emailService.sendSummaryToManager(summary);
            return {
                success: true,
                message: 'Scenario completed successfully',
                summary,
                emailPreviewUrl: previewUrl,
            };
        }
        catch (error) {
            this.logger.error('Error during scenario execution', error.message || error);
            throw new common_1.HttpException({ success: false, error: 'Scenario failed to execute: ' + error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ScenarioController = ScenarioController;
__decorate([
    (0, common_1.Post)('trigger'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "triggerScenario", null);
exports.ScenarioController = ScenarioController = ScenarioController_1 = __decorate([
    (0, common_1.Controller)('scenario'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService,
        openclaw_service_1.OpenclawService,
        email_service_1.EmailService])
], ScenarioController);
//# sourceMappingURL=scenario.controller.js.map