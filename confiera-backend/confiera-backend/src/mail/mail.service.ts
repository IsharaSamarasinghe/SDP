import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.config.get('SMTP_HOST'),
            port: this.config.get('SMTP_PORT'),
            secure: this.config.get('SMTP_PORT') === 465, // true for 465, false for other ports
            auth: {
                user: this.config.get('SMTP_USER'),
                pass: this.config.get('SMTP_PASS'),
            },
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `${this.config.get('FRONTEND_URL')}/verify-email?token=${token}`;

        // DEMO LOGGING (Always shows in console)
        console.log('\n' + '='.repeat(50));
        console.log('📧 TEST EMAIL: VERIFY ACCOUNT');
        console.log(`To: ${email}`);
        console.log(`Link: ${url}`);
        console.log('='.repeat(50) + '\n');

        const mailOptions = {
            from: this.config.get('EMAIL_FROM'),
            to: email,
            subject: 'Confirm your Confiera Account',
            html: `
                <h1>Welcome to Confiera</h1>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="${url}">${url}</a></p>
                <p>This link expires in 24 hours.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Verification email sent to ${email}`);
        } catch (error) {
            this.logger.warn(`SMTP not configured or failed, but demo link logged above for ${email}`);
        }
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const url = `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;

        // DEMO LOGGING (Always shows in console)
        console.log('\n' + '='.repeat(50));
        console.log('📧 TEST EMAIL: PASSWORD RESET');
        console.log(`To: ${email}`);
        console.log(`Link: ${url}`);
        console.log('='.repeat(50) + '\n');

        const mailOptions = {
            from: this.config.get('EMAIL_FROM'),
            to: email,
            subject: 'Reset your Confiera Password',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested to reset your password. Click the link below to proceed:</p>
                <p><a href="${url}">${url}</a></p>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.warn(`SMTP not configured or failed, but demo link logged above for ${email}`);
        }
    }
}
