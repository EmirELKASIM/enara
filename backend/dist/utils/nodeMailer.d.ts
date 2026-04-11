/**
 * دالة عامة لإرسال أي بريد
 */
export declare const sendEmail: (to: string, subject: string, html: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
/**
 * دالة لإرسال بريد التحقق للمستخدم
 */
export declare const sendVerificationEmail: (user: any) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
//# sourceMappingURL=nodeMailer.d.ts.map