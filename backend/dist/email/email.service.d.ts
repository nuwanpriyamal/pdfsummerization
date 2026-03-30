export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    private initTransporter;
    sendSummaryToManager(summary: string): Promise<string>;
}
