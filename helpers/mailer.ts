import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Mailtrap Transport
  const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    // ✅ OTP Case
    if (emailType === "OTP") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

      // Save OTP in DB
      await User.findByIdAndUpdate(userId, {
        otp,
        otpExpiry,
      });

      const mailOptions = {
        from: "ajay@pancholi.ai",
        to: email,
        subject: "OTP Verification Code",
        html: `
          <h2>Your OTP is: <b>${otp}</b></h2>
          <p>This OTP is valid for 5 minutes.</p>
        `,
      };

      const mailResponse = await transport.sendMail(mailOptions);
      return { mailResponse, otp };
    }

    // ✅ VERIFY / RESET Case
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    const mailOptions = {
      from: "ajay@pancholi.ai",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>
        Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
        to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        <br/><br/>
        Or copy and paste this link:
        <br/>
        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return { mailResponse, token: hashedToken };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
