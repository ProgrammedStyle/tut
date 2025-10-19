import axios from 'axios';
import pkg from 'nodemailer';
const { createTransport } = pkg;

/**
 * Universal Email Service with SendGrid HTTP API + Gmail SMTP Fallback
 * This service handles all email sending across the application
 */

const sendEmail = async (emailData) => {
    const { to, subject, html, fromName = 'Support Team' } = emailData;
    
    console.log('📧 Email Service: Starting email send process');
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);
    console.log('📧 From Name:', fromName);
    
    // Validate required fields
    if (!to || !subject || !html) {
        throw new Error('Missing required email fields: to, subject, html');
    }
    
    let emailSent = false;
    let emailMethod = 'none';
    let errorDetails = null;
    
    // Try SendGrid HTTP API first
    try {
        console.log('📧 Attempting SendGrid HTTP API...');
        console.log('📧 SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
        
        const sendGridData = {
            personalizations: [{
                to: [{ email: to }],
                subject: subject
            }],
            from: { 
                email: process.env.SMTP_USER || 'programmedstyle@gmail.com', 
                name: fromName 
            },
            content: [{
                type: 'text/html',
                value: html
            }]
        };
        
        const response = await axios.post('https://api.sendgrid.com/v3/mail/send', sendGridData, {
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ SendGrid email sent successfully');
        console.log('📧 SendGrid response status:', response.status);
        
        emailSent = true;
        emailMethod = 'SendGrid';
        
    } catch (sendGridError) {
        console.error('❌ SendGrid failed:', sendGridError.message);
        console.log('🔄 Falling back to Gmail SMTP...');
        errorDetails = sendGridError.message;
        
        // Fallback to Gmail SMTP
        try {
            const transporter = createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_USER || "programmedstyle@gmail.com",
                    pass: process.env.SMTP_PASS || "brao ywhw gzux rhib"
                }
            });
            
            const mailOptions = {
                from: `${fromName} <${process.env.SMTP_USER || "programmedstyle@gmail.com"}>`,
                to: to,
                subject: subject,
                html: html
            };
            
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Gmail SMTP email sent successfully');
            console.log('📧 Gmail message ID:', info.messageId);
            
            emailSent = true;
            emailMethod = 'Gmail SMTP';
            
        } catch (gmailError) {
            console.error('❌ Gmail SMTP also failed:', gmailError.message);
            emailSent = false;
            emailMethod = 'failed';
            errorDetails = gmailError.message;
        }
    }
    
    if (!emailSent) {
        throw new Error(`Email sending failed via both SendGrid and Gmail SMTP. Last error: ${errorDetails}`);
    }
    
    console.log(`✅ Email sent successfully via ${emailMethod}`);
    return {
        success: true,
        method: emailMethod,
        message: `Email sent successfully via ${emailMethod}`
    };
};

/**
 * Send email verification for account creation
 */
export const sendEmailVerification = async (email, token) => {
    const verifyURL = `${process.env.CLIENT_URL}/CreateAccount/VerifyEmail/Check/?token=${token}`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Email Verification Required</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">Welcome!</h2>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Thank you for creating an account. To complete your registration, please verify your email address by clicking the button below.
                    </p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${verifyURL}" style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                            Verify Email Address
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px; text-align: center;">
                        This link will expire in 15 minutes.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        ${verifyURL}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return await sendEmail({
        to: email,
        subject: "Please verify your email address",
        html: html,
        fromName: "Account Verification"
    });
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email, token) => {
    const resetURL = `${process.env.CLIENT_URL}/ResetPassword?token=${token}`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        You requested to reset your password. Click the button below to create a new password.
                    </p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${resetURL}" style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px; text-align: center;">
                        This link will expire in 15 minutes.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        If you didn't request this, please ignore this email and your password will remain unchanged.
                    </p>
                    <p style="color: #999; font-size: 12px;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        ${resetURL}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html: html,
        fromName: "Password Reset"
    });
};

/**
 * Send email verification for profile email change
 */
export const sendProfileEmailVerification = async (email, token) => {
    const verifyURL = `${process.env.CLIENT_URL}/Dashboard/verify-email?token=${token}`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Email Address Change Verification</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">Verify Your New Email Address</h2>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        You have requested to change your email address to <strong>${email}</strong>.
                    </p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Please click the button below to verify your new email address:
                    </p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${verifyURL}" style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                            Verify New Email Address
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px; text-align: center;">
                        This link will expire in 15 minutes.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        If you did not request this change, please ignore this email.
                    </p>
                    <p style="color: #999; font-size: 12px;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        ${verifyURL}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return await sendEmail({
        to: email,
        subject: "Verify your new email address",
        html: html,
        fromName: "Email Verification"
    });
};

/**
 * Send contact form emails (admin notification + user confirmation)
 */
export const sendContactFormEmails = async (formData) => {
    const { name, email, subject, message } = formData;
    
    // Admin notification email
    const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-left: 4px solid #667eea; border-radius: 5px;">
                        <h3 style="margin: 0 0 10px 0; color: #333;">Message:</h3>
                        <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            </div>
            <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
                <p style="margin: 0;">This is an automated message from your contact form</p>
                <p style="margin: 5px 0;">Received at ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
    
    // User confirmation email
    const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        We've received your message and appreciate you taking the time to reach out to us. 
                        Our team will review your inquiry and get back to you as soon as possible.
                    </p>
                    <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-left: 4px solid #667eea; border-radius: 5px;">
                        <h3 style="margin: 0 0 10px 0; color: #333;">Your Message:</h3>
                        <p style="margin: 0; color: #666;"><strong>Subject:</strong> ${subject}</p>
                        <p style="margin: 10px 0 0 0; line-height: 1.6; white-space: pre-wrap; color: #666;">${message}</p>
                    </div>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        If you have any urgent concerns, please feel free to call us directly.
                    </p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 0;">
                        Best regards,<br>
                        <strong>The Support Team</strong>
                    </p>
                </div>
            </div>
            <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
                <p style="margin: 0;">This is an automated confirmation email</p>
            </div>
        </div>
    `;
    
    // Send both emails
    const adminResult = await sendEmail({
        to: process.env.SMTP_USER || 'programmedstyle@gmail.com',
        subject: `[Contact Form] ${subject}`,
        html: adminHtml,
        fromName: 'Contact Form'
    });
    
    const userResult = await sendEmail({
        to: email,
        subject: `We received your message: ${subject}`,
        html: userHtml,
        fromName: 'Contact Form'
    });
    
    return {
        adminResult,
        userResult,
        success: adminResult.success && userResult.success
    };
};

export default {
    sendEmail,
    sendEmailVerification,
    sendPasswordReset,
    sendProfileEmailVerification,
    sendContactFormEmails
};
