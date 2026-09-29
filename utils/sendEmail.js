const nodemailer = require('nodemailer');

/**
 * sendOtpEmail Utility
 * Sends a 6-digit OTP verification code to the user's email.
 * Falls back to printing the code in a prominent console box if SMTP is not configured.
 */
async function sendOtpEmail(toEmail, otp, username) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Console Logging Box (Always print to console so it's easily testable locally!)
    console.log("\n" + "=".repeat(60));
    console.log(`| VERIFICATION CODE FOR ${username.toUpperCase()}:`);
    console.log(`| Code: ${otp}`);
    console.log(`| Expires in: 5 minutes`);
    console.log("=".repeat(60) + "\n");

    // If SMTP credentials are not set, don't attempt to send a real email
    if (!emailUser || !emailPass) {
        console.warn("SMTP credentials (EMAIL_USER/EMAIL_PASS) are not configured in your .env file.");
        console.warn("Using console log fallback for local testing.");
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Default service (can be configured)
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        const mailOptions = {
            from: `"Dream Land Security" <${emailUser}>`,
            to: toEmail,
            subject: 'Your Dream Land Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #fe424d; text-align: center;">Dream Land Login Verification</h2>
                    <p>Hello <strong>${username}</strong>,</p>
                    <p>We received a request to log in to your account. Use the following verification code to complete your login:</p>
                    <div style="background-color: #f7f7f7; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #333; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent: ${info.messageId}`);
    } catch (err) {
        console.error("Failed to send verification email:", err.message);
    }
}

module.exports = sendOtpEmail;
