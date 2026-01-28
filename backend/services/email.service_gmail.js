import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function sendVerificationEmail(toEmail, verifyUrl) {
  console.log("[EMAIL] start sendVerificationEmail", {
    toEmail,
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  try {
    console.log("[EMAIL] verifying SMTP connection...");
    await transporter.verify();
    console.log("[EMAIL] SMTP verify OK");
  } catch (err) {
    console.error("[EMAIL] SMTP verify FAILED", {
      message: err?.message,
      code: err?.code,
      command: err?.command,
    });
    throw err;
  }

  const templatePath = path.resolve(
    process.cwd(),
    "templates/verify-email.html"
  );

  console.log("[EMAIL] reading template from", templatePath);

  let html;
  try {
    html = fs.readFileSync(templatePath, "utf-8");
  } catch (err) {
    console.error("[EMAIL] failed to read template", err);
    throw err;
  }

  html = html
    .replaceAll("{{VERIFY_URL}}", verifyUrl)
    .replaceAll("{{YEAR}}", new Date().getFullYear());

  try {
    console.log("[EMAIL] sending mail...");
    const info = await transporter.sendMail({
      from: `"Atlas Bank" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Verify your Atlas Bank account",
      html,
    });
    console.log("[EMAIL] mail sent OK", {
      messageId: info.messageId,
      response: info.response,
    });
  } catch (err) {
    console.error("[EMAIL] sendMail FAILED", {
      message: err?.message,
      code: err?.code,
      command: err?.command,
      response: err?.response,
    });
    throw err;
  }
}
