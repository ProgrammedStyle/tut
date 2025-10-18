import axios from 'axios';
import pkg from 'nodemailer';
const { createTransport } = pkg;

const submitContactForm = async (req, res) => {
    try {
        console.log('📧 Contact form API called');
        console.log('📧 Request body:', req.body);
        console.log('📧 Request method:', req.method);
        console.log('📧 Request URL:', req.url);
        console.log('📧 Request headers:', req.headers);
        
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        console.log('📧 Contact form submission received:', {
            name,
            email,
            subject,
            messageLength: message.length
        });

        // Try SendGrid HTTP API first, fallback to Gmail SMTP if it fails
        let emailSent = false;
        let emailMethod = 'none';
        
        try {
            console.log('📧 Attempting to send emails using SendGrid HTTP API...');
            console.log('📧 SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
            console.log('📧 SENDGRID_API_KEY length:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);
            console.log('📧 SENDGRID_API_KEY starts with:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 10) + '...' : 'N/A');
            
            // Send admin notification email
            const adminEmailData = {
                personalizations: [{
                    to: [{ email: process.env.SMTP_USER || 'programmedstyle@gmail.com' }],
                    subject: `[Contact Form] ${subject}`
                }],
                from: { email: process.env.SMTP_USER || 'programmedstyle@gmail.com', name: 'Contact Form' },
                content: [{
                    type: 'text/html',
                    value: `
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
                    `
                }]
            };

            // Send user confirmation email
            const userEmailData = {
                personalizations: [{
                    to: [{ email: email }],
                    subject: `We received your message: ${subject}`
                }],
                from: { email: process.env.SMTP_USER || 'programmedstyle@gmail.com', name: 'Contact Form' },
                content: [{
                    type: 'text/html',
                    value: `
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
                    `
                }]
            };

            // Send both emails using SendGrid HTTP API
            const sendEmail = async (emailData) => {
                const response = await axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
                    headers: {
                        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response;
            };

            const adminResponse = await sendEmail(adminEmailData);
            console.log('✅ Admin notification email sent via SendGrid');
            console.log('📧 Admin response status:', adminResponse.status);
            console.log('📧 Admin response headers:', adminResponse.headers);
            
            const userResponse = await sendEmail(userEmailData);
            console.log('✅ User confirmation email sent via SendGrid to:', email);
            console.log('📧 User response status:', userResponse.status);
            console.log('📧 User response headers:', userResponse.headers);
            
            emailSent = true;
            emailMethod = 'SendGrid';
            
        } catch (sendGridError) {
            console.error('❌ SendGrid failed:', sendGridError.message);
            console.log('🔄 Falling back to Gmail SMTP...');
            
            // Fallback to Gmail SMTP
            try {
                const transporter = createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.SMTP_USER || "programmedstyle@gmail.com",
                        pass: process.env.SMTP_PASS || "brao ywhw gzux rhib"
                    }
                });

                // Admin notification email
                const adminMailOptions = {
                    from: process.env.SMTP_USER || "programmedstyle@gmail.com",
                    to: process.env.SMTP_USER || "programmedstyle@gmail.com",
                    subject: `[Contact Form] ${subject}`,
                    html: `
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
                    `
                };

                // User confirmation email
                const userMailOptions = {
                    from: process.env.SMTP_USER || "programmedstyle@gmail.com",
                    to: email,
                    subject: `We received your message: ${subject}`,
                    html: `
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
                    `
                };

                await transporter.sendMail(adminMailOptions);
                console.log('✅ Admin notification email sent via Gmail SMTP');
                
                await transporter.sendMail(userMailOptions);
                console.log('✅ User confirmation email sent via Gmail SMTP to:', email);
                
                emailSent = true;
                emailMethod = 'Gmail SMTP';
                
            } catch (gmailError) {
                console.error('❌ Gmail SMTP also failed:', gmailError.message);
                emailSent = false;
                emailMethod = 'failed';
            }
        }

        // Only return success if email was actually sent
        if (emailSent) {
            res.status(200).json({
                success: true,
                message: `Message sent successfully via ${emailMethod}. We'll get back to you soon!`
            });
            console.log(`✅ Contact form response sent successfully via ${emailMethod}`);
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send message. Please try again later."
            });
            console.log('❌ Contact form response sent with error - email failed');
        }

    } catch (error) {
        console.error('❌ Contact form error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error name:', error.name);
        res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later."
        });
    }
};

export default submitContactForm;

