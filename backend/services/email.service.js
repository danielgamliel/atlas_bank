import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function sendVerificationEmail(toEmail, verifyUrl) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const templatePath = path.resolve(
    process.cwd(),
    "templates/verify-email.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replaceAll("{{VERIFY_URL}}", verifyUrl)
    .replaceAll("{{YEAR}}", new Date().getFullYear());

  await transporter.sendMail({
    from: `"Atlas Bank" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your Atlas Bank account",
    html
  });
}
