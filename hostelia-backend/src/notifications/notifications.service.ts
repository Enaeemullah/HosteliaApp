import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined,
  });

  async sendFeeReminder(to: string, payload: { student: string; amount: number; dueDate: string }) {
    if (!to) {
      this.logger.warn(`Missing email for student ${payload.student}`);
      return;
    }
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@hostelia.com',
      to,
      subject: 'Hostelia Fee Reminder',
      text: `Hi ${payload.student}, your monthly fee of ${payload.amount} is due on ${payload.dueDate}. Please complete the payment to avoid penalties.`,
    };
    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Fee reminder sent to ${to}`);
  }
}
