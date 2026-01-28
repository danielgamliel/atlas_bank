// controllers/auth.controller.js
import { validateSignup, validateLogin } from "../validations/auth.validation.js";
import { hashPassword } from "../utils/password.js";
import { createVerificationToken } from "../utils/verificationToken.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { createUser } from "../services/users.service.js";
import {loginWithEmailPassword,verifyEmailByToken} from "../services/auth.services.js";

/* ========================= Small temp logger ========================= */

const rid = (req) => req.reqId ? `request ID: ${req.reqId}` : "no-rid";

function safeBodyKeys(body) {
  if (!body || typeof body !== "object") return "NO_BODY";
  return Object.keys(body);
}

function log(req, msg, data) {
  if (data !== undefined) console.log(`[${rid(req)}] ${msg}`, data);
  else console.log(`[${rid(req)}] ${msg}`);
}

function errToLog(err) {
  return {
    name: err && err.name,
    message: err && err.message,
    status: err && err.status,
    code: err && err.code,
    codeName: err && err.codeName
  };
}

async function withLogs(req, label, fn) {
  const start = Date.now();

  log(req, `${label} START`, {
    method: req.method,
    url: req.originalUrl,
    bodyKeys: safeBodyKeys(req.body),
    contentType: req.headers["content-type"] || "none"
  });

  try {
    const out = await fn();
    log(req, `${label} OK (${Date.now() - start}ms)`);
    return out;
  } catch (err) {
    log(req, `${label} FAIL (${Date.now() - start}ms)`, errToLog(err));
    throw err;
  }
}

/* ========================= Error mapping ========================= */

function toErrorResponse(err) {
  /* Mongo duplicate key */
  if (err && (err.code === 11000 || err.codeName === "DuplicateKey")) {
    return {
      status: 409,
      body: {
        success: false,
        error: {
          code: "DUPLICATE_EMAIL",
          message: "An account with this email already exists"
        }
      }
    };
  }

  /* Auth invalid credentials */
  if (err && err.status === 401) {
    return {
      status: 401,
      body: {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: err.message || "Invalid credentials"
        }
      }
    };
  }

  /* Generic bad request */
  return {
    status: err && err.status ? err.status : 400,
    body: {
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: (err && err.message) ? err.message : "Bad request"
      }
    }
  };
}

/* ========================= Controllers ========================= */

export async function login(req, res) {
  try {
    return await withLogs(req, "AUTH.LOGIN", async () => {
      const creds = validateLogin(req.body);
      log(req, "AUTH.LOGIN validated", { email: creds.email });
      console.log("[LOGIN] secret prefix:", String(process.env.JWT_SECRET || "").slice(0, 6));


      const result = await loginWithEmailPassword(creds.email, creds.password);
      const token = result.token;

      if(!token) throw Object.assign(new Error("No token generated"), { status: 500 })

      log(req, "AUTH.LOGIN service success", { email: creds.email });

      const isProd = !!process.env.RENDER || process.env.NODE_ENV === "production";

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

      return res.status(200).json({ success: true, data: { user: result.user } });
    });
  } catch (err) {
    const out = toErrorResponse(err);
    log(req, "AUTH.LOGIN response", { status: out.status, code: out.body && out.body.error && out.body.error.code });
    return res.status(out.status).json(out.body);
  }
}

export async function signup(req, res) {
  try {
    return await withLogs(req, "AUTH.SIGNUP", async () => {
      const { email, password, firstName, lastName, phone } = validateSignup(req.body);

      log(req, "AUTH.SIGNUP validated", { email });

      const passwordHash = await hashPassword(password);
      log(req, "AUTH.SIGNUP password hashed");

      const tokenData = createVerificationToken();
      log(req, "AUTH.SIGNUP token created", { expiresAt: tokenData.expiresAt });

      const verifyUrl = `${process.env.SERVER_URL}/api/v1/auth/verify?token=${tokenData.token}`;

      const user = await createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        verificationToken: tokenData.token,
        verificationExpiresAt: tokenData.expiresAt
      });

      log(req, "AUTH.SIGNUP user created", { userId: user && user._id });

      await sendVerificationEmail(email, verifyUrl);
      log(req, "AUTH.SIGNUP email sent", { email });

      return res.status(201).json({success: true,data: { id: user._id, email: user.email }});
    });
  } catch (err) {
    const out = toErrorResponse(err);
    log(req, "AUTH.SIGNUP response", { status: out.status, code: out.body && out.body.error && out.body.error.code });
    return res.status(out.status).json(out.body);
  }
}

export async function verifyLink(req, res) {
  try {
    return await withLogs(req, "AUTH.VERIFY", async () => {
      const token = req.query && req.query.token;

      log(req, "AUTH.VERIFY token present", Boolean(token));

      if (!token) return res.status(400).json({success: false, error: { code: "MISSING_TOKEN", message: "Missing token" }});

      const user = await verifyEmailByToken(token);
      log(req, "AUTH.VERIFY verified", { userId: user && user._id });

      return res.status(200).json({success: true, data: { message: "Email verified" }});
    });
  } catch (err) {
    const out = toErrorResponse(err);
    log(req, "AUTH.VERIFY response", { status: out.status, code: out.body && out.body.error && out.body.error.code });
    return res.status(out.status).json(out.body);
  }
}

export async function logout(req, res) {
  const isProd = !!process.env.RENDER || process.env.NODE_ENV === "production";

res.clearCookie("accessToken", {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
});

return res.status(200).json({ success: true });

}

