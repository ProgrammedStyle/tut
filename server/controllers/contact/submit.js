import pkg from 'nodemailer';
const { createTransport } = pkg;

const submitContactForm = async (req, res) => {
    try {
        console.log('📧 Contact form API called');
        console.log('📧 Request body:', req.body);
        
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

        // Set up email transporter with improved settings
        const transporter = createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            connectionTimeout: 60000, // 60 seconds
            greetingTimeout: 15000,    // 15 seconds
            socketTimeout: 60000,      // 60 seconds
            pool: false,               // Disable pooling for better reliability
            maxConnections: 1,         // Limit connections
            rateLimit: 1,              // Limit rate
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
                ciphers: 'SSLv3'
            },
            debug: true,               // Enable debug logging
            logger: true               // Enable logger
        });

        // Email to admin/support
        const adminMailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to yourself
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

        // Confirmation email to user
        const userMailOptions = {
            from: process.env.SMTP_USER,
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

        // Send emails with timeout
        let emailSent = false;
        try {
            console.log('📧 Attempting to send emails...');
            console.log('📧 SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set');
            console.log('📧 SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set');
            
            // Verify SMTP connection first
            console.log('📧 Verifying SMTP connection...');
            await transporter.verify();
            console.log('✅ SMTP connection verified');
            
            const emailPromise = Promise.all([
                transporter.sendMail(adminMailOptions),
                transporter.sendMail(userMailOptions)
            ]);
            
            // Add timeout to email sending
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Email sending timeout after 30 seconds')), 30000); // 30 seconds timeout
            });
            
            await Promise.race([emailPromise, timeoutPromise]);
            
            console.log('✅ Admin notification email sent');
            console.log('✅ User confirmation email sent to:', email);
            emailSent = true;
        } catch (emailError) {
            console.error('❌ Failed to send email:', emailError);
            console.error('❌ Email error details:', {
                message: emailError.message,
                code: emailError.code,
                command: emailError.command
            });
            emailSent = false;
        }

        // Only return success if email was actually sent
        if (emailSent) {
            res.status(200).json({
                success: true,
                message: "Message sent successfully. We'll get back to you soon!"
            });
            console.log('✅ Contact form response sent successfully');
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send message. Please try again later."
            });
            console.log('❌ Contact form response sent with error - email failed');
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later."
        });
    }
};

export default submitContactForm;

