import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      // Use Real Gmail Account
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
      this.logger.log(`Using real Gmail SMTP for sending.`);
    } else {
      // Fallback to Test Account
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      this.logger.log(`Using Ethereal Fake Email: ${testAccount.user}`);
    }
  }

  async sendSummaryToManager(summary: string): Promise<string> {
    if (!this.transporter) {
      await this.initTransporter();
    }
    
    this.logger.log('Sending email...');
    const info = await this.transporter.sendMail({
      from: '"OpenClaw Agent" <agent@openclaw.local>',
      to: 'nuwanpriyamal@gmail.com',
      subject: 'Automated AI Summary: PDF Document',
      text: summary,
      html: `<p><b>Automated AI Summary:</b></p><br/><p>${summary.replace(/\\n/g, '<br/>')}</p>`,
    });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.logger.log(`Real email successfully dispatched to nuwanpriyamal@gmail.com`);
      return '';
    } else {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      this.logger.log(`Message simulated. Preview URL: ${previewUrl}`);
      return previewUrl ? previewUrl.toString() : '';
    }
  }
}
