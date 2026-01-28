import fs from "fs";
import path from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(toEmail, verifyUrl) {
  console.log("[EMAIL] start sendVerificationEmail (RESEND)", {
    toEmail,
    hasApiKey: !!process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
  });

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
    console.log("[EMAIL] sending via Resend...");
    const result = await resend.emails.send({
      from: `Atlas Bank <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: "Verify your Atlas Bank account",
      html,
    });

    console.log("[EMAIL] Resend sent OK", {
      id: result?.data?.id,
    });
  } catch (err) {
    console.error("[EMAIL] Resend FAILED", {
      message: err?.message,
      name: err?.name,
      statusCode: err?.statusCode,
      error: err,
    });
    throw err;
  }
}
