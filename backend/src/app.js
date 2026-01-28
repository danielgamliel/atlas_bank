import express from "express";
import { API_BASE } from "../config/constants.js";
import crypto from "crypto";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import transactionsRoutes from "../routes/transactions.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    req.reqId = crypto.randomUUID().slice(0, 8);  //request ID
    next();
  });
  
  const allowedOrigins = [
    "http://localhost:5173",
    "https://atlas-bank-k2vo.onrender.com",
  ];

  app.set("trust proxy", 1);
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }));
  
  

  
  app.get("/", (req, res) => {res.status(200).send(" *DEBUGING* Welcome to the Home Page")});


  app.use(`${API_BASE}/auth`, authRoutes);
  app.use(`${API_BASE}`, userRoutes);
  app.use(`${API_BASE}`, transactionsRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  });

  return app;
}
