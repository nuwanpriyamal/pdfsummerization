import { PdfService } from '../pdf/pdf.service';
import { OpenclawService } from '../openclaw/openclaw.service';
import { EmailService } from '../email/email.service';
export declare class ScenarioController {
    private readonly pdfService;
    private readonly openclawService;
    private readonly emailService;
    private readonly logger;
    constructor(pdfService: PdfService, openclawService: OpenclawService, emailService: EmailService);
    triggerScenario(file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        summary: string;
        emailPreviewUrl: string;
    }>;
}
