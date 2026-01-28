//middlewares/authenticate.js
import { verifyAccessToken } from "../utils/jwt.js";

export default function authenticate(req, res, next) {
  try {
    const fromCookie = req.cookies && req.cookies.accessToken;

    const authHeader = req.headers.authorization;
    const fromHeader =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : null;

    const token = fromCookie || fromHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const payload = verifyAccessToken(token);

    const userId = payload.id || payload.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    req.user = { ...payload, id: String(userId) };
    return next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
}
