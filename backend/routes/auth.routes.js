import { Router } from "express";
import { login, logout, signup, verifyLink } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.post("/signup", signup);
router.get("/verify", verifyLink);
router.post("/login", login);
router.post("/logout", logout);



export default router;

