import { sendContactFormEmails } from "../../services/emailService.js";

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

        // Send emails using the new email service
        console.log('📧 Sending contact form emails...');
        const result = await sendContactFormEmails({ name, email, subject, message });
        
        console.log('✅ Contact form emails sent successfully');
        console.log('📧 Admin email method:', result.adminResult.method);
        console.log('📧 User email method:', result.userResult.method);

        // Only return success if emails were actually sent
        if (result.success) {
            res.status(200).json({
                success: true,
                message: `Message sent successfully via ${result.adminResult.method}. We'll get back to you soon!`
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

